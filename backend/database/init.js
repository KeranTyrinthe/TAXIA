import initSqlJs from 'sql.js';
import bcrypt from 'bcryptjs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync, writeFileSync, existsSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const dbPath = join(__dirname, 'taxia.db');

let db;
let SQL;

async function initDB() {
  SQL = await initSqlJs();
  
  // Charger la base de données existante ou créer une nouvelle
  if (existsSync(dbPath)) {
    const buffer = readFileSync(dbPath);
    db = new SQL.Database(buffer);
  } else {
    db = new SQL.Database();
  }
  
  return db;
}

// Sauvegarder la base de données
function saveDatabase() {
  if (db) {
    const data = db.export();
    writeFileSync(dbPath, data);
  }
}

// Wrapper pour les opérations de base de données
const dbWrapper = {
  prepare: (sql) => ({
    run: (...params) => {
      const stmt = db.prepare(sql);
      stmt.bind(params);
      stmt.step();
      const lastId = db.exec("SELECT last_insert_rowid()")[0]?.values[0][0] || 0;
      stmt.free();
      saveDatabase();
      return { lastInsertRowid: lastId };
    },
    get: (...params) => {
      const stmt = db.prepare(sql);
      stmt.bind(params);
      const result = stmt.step() ? stmt.getAsObject() : null;
      stmt.free();
      return result;
    },
    all: (...params) => {
      const stmt = db.prepare(sql);
      stmt.bind(params);
      const results = [];
      while (stmt.step()) {
        results.push(stmt.getAsObject());
      }
      stmt.free();
      return results;
    }
  }),
  exec: (sql) => {
    db.run(sql);
    saveDatabase();
  },
  pragma: (pragma) => {
    db.run(`PRAGMA ${pragma}`);
  }
};

// Initialiser la base de données au démarrage
await initDB();

export function initDatabase() {
  // Table des utilisateurs (clients, chauffeurs, admins)
  dbWrapper.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      phone TEXT UNIQUE,
      password TEXT,
      email TEXT,
      role TEXT NOT NULL CHECK(role IN ('client', 'driver', 'admin')),
      city TEXT NOT NULL,
      status TEXT DEFAULT 'active' CHECK(status IN ('active', 'inactive', 'suspended')),
      photo TEXT,
      google_id TEXT UNIQUE,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Table des chauffeurs (infos supplémentaires)
  dbWrapper.exec(`
    CREATE TABLE IF NOT EXISTS drivers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER UNIQUE NOT NULL,
      vehicle_model TEXT NOT NULL,
      vehicle_plate TEXT UNIQUE NOT NULL,
      license_number TEXT,
      rating REAL DEFAULT 0.0,
      total_rides INTEGER DEFAULT 0,
      availability TEXT DEFAULT 'offline' CHECK(availability IN ('available', 'busy', 'offline')),
      balance REAL DEFAULT 0.0,
      current_lat REAL,
      current_lng REAL,
      last_location_update DATETIME,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);
  
  // Ajouter les colonnes GPS si elles n'existent pas (migration)
  try {
    dbWrapper.exec(`ALTER TABLE drivers ADD COLUMN current_lat REAL`);
    dbWrapper.exec(`ALTER TABLE drivers ADD COLUMN current_lng REAL`);
    dbWrapper.exec(`ALTER TABLE drivers ADD COLUMN last_location_update DATETIME`);
    console.log('✅ Colonnes GPS ajoutées à la table drivers');
  } catch (err) {
    // Les colonnes existent déjà, c'est normal
  }

  // Table des courses
  dbWrapper.exec(`
    CREATE TABLE IF NOT EXISTS rides (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      client_id INTEGER NOT NULL,
      driver_id INTEGER,
      pickup_address TEXT NOT NULL,
      pickup_lat REAL,
      pickup_lng REAL,
      dropoff_address TEXT NOT NULL,
      dropoff_lat REAL,
      dropoff_lng REAL,
      distance REAL,
      duration INTEGER,
      price REAL,
      status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'waiting_price', 'price_sent', 'price_accepted', 'price_rejected', 'assigned', 'driver_on_way', 'driver_arrived', 'in_progress', 'completed', 'cancelled')),
      payment_status TEXT DEFAULT 'unpaid' CHECK(payment_status IN ('unpaid', 'paid', 'pending_transfer')),
      rating INTEGER CHECK(rating >= 1 AND rating <= 5),
      comment TEXT,
      route_geometry TEXT,
      estimated_arrival_time INTEGER,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      started_at DATETIME,
      completed_at DATETIME,
      FOREIGN KEY (client_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (driver_id) REFERENCES users(id) ON DELETE SET NULL
    )
  `);

  // Table des paiements/versements
  dbWrapper.exec(`
    CREATE TABLE IF NOT EXISTS payments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      driver_id INTEGER NOT NULL,
      amount REAL NOT NULL,
      type TEXT NOT NULL CHECK(type IN ('ride_payment', 'transfer_to_admin')),
      ride_id INTEGER,
      status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'completed', 'cancelled')),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      completed_at DATETIME,
      FOREIGN KEY (driver_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (ride_id) REFERENCES rides(id) ON DELETE SET NULL
    )
  `);

  // Table des notifications
  dbWrapper.exec(`
    CREATE TABLE IF NOT EXISTS notifications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      title TEXT NOT NULL,
      message TEXT NOT NULL,
      type TEXT NOT NULL,
      read INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  // Table des paramètres système
  dbWrapper.exec(`
    CREATE TABLE IF NOT EXISTS settings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      key TEXT UNIQUE NOT NULL,
      value TEXT NOT NULL,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Créer un admin par défaut
  const adminExists = dbWrapper.prepare('SELECT id FROM users WHERE role = ?').get('admin');
  
  if (!adminExists) {
    const hashedPassword = bcrypt.hashSync('Dimanche07', 10);
    dbWrapper.prepare(`
      INSERT INTO users (name, phone, password, role, city, email)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(
      'Keran Nexus',
      '+243999224209',
      hashedPassword,
      'admin',
      'Kinshasa',
      'keranenexus@gmail.com'
    );
    
    console.log('✅ Admin créé - Téléphone: +243999224209');
  }

  // Créer des chauffeurs de test
  const driversCount = dbWrapper.prepare('SELECT COUNT(*) as count FROM users WHERE role = ?').get('driver');
  
  if (!driversCount || driversCount.count === 0) {
    const hashedPassword = bcrypt.hashSync('driver123', 10);
    
    // Chauffeur 1 - Kinshasa
    const driver1Result = dbWrapper.prepare(`
      INSERT INTO users (name, phone, password, role, city)
      VALUES (?, ?, ?, ?, ?)
    `).run('Jean Kabongo', '+243810000001', hashedPassword, 'driver', 'Kinshasa');
    
    dbWrapper.prepare(`
      INSERT INTO drivers (user_id, vehicle_model, vehicle_plate, license_number, availability, current_lat, current_lng)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(driver1Result.lastInsertRowid, 'Toyota Corolla', 'KIN-001-AB', 'DL001', 'available', -4.3, 15.3);
    
    // Chauffeur 2 - Kinshasa
    const driver2Result = dbWrapper.prepare(`
      INSERT INTO users (name, phone, password, role, city)
      VALUES (?, ?, ?, ?, ?)
    `).run('Marie Tshimanga', '+243810000002', hashedPassword, 'driver', 'Kinshasa');
    
    dbWrapper.prepare(`
      INSERT INTO drivers (user_id, vehicle_model, vehicle_plate, license_number, availability, current_lat, current_lng)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(driver2Result.lastInsertRowid, 'Honda Civic', 'KIN-002-CD', 'DL002', 'available', -4.32, 15.32);
    
    // Chauffeur 3 - Lubumbashi
    const driver3Result = dbWrapper.prepare(`
      INSERT INTO users (name, phone, password, role, city)
      VALUES (?, ?, ?, ?, ?)
    `).run('Pierre Mwamba', '+243810000003', hashedPassword, 'driver', 'Lubumbashi');
    
    dbWrapper.prepare(`
      INSERT INTO drivers (user_id, vehicle_model, vehicle_plate, license_number, availability, current_lat, current_lng)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(driver3Result.lastInsertRowid, 'Nissan Sentra', 'LUB-001-EF', 'DL003', 'available', -11.67, 27.47);
    
    console.log('✅ 3 chauffeurs de test créés (password: driver123)');
  }

  // Paramètres par défaut
  const settingsDefaults = [
    { key: 'base_price', value: '1000' },
    { key: 'price_per_km', value: '500' },
    { key: 'commission_rate', value: '0.15' }
  ];

  settingsDefaults.forEach(setting => {
    dbWrapper.prepare(`
      INSERT OR IGNORE INTO settings (key, value) VALUES (?, ?)
    `).run(setting.key, setting.value);
  });

  console.log('✅ Base de données initialisée avec succès');
}

export default dbWrapper;
