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

// Wrapper pour exec
function exec(sql) {
  db.run(sql);
  saveDatabase();
}

// Wrapper pour prepare().run()
function run(sql, ...params) {
  const stmt = db.prepare(sql);
  stmt.bind(params);
  stmt.step();
  stmt.free();
  saveDatabase();
  return { lastInsertRowid: db.exec("SELECT last_insert_rowid()")[0].values[0][0] };
}

// Wrapper pour prepare().get()
function get(sql, ...params) {
  const stmt = db.prepare(sql);
  stmt.bind(params);
  const result = stmt.step() ? stmt.getAsObject() : null;
  stmt.free();
  return result;
}

// Wrapper pour prepare().all()
function all(sql, ...params) {
  const stmt = db.prepare(sql);
  stmt.bind(params);
  const results = [];
  while (stmt.step()) {
    results.push(stmt.getAsObject());
  }
  stmt.free();
  return results;
}

// Sauvegarder la base de données
function saveDatabase() {
  const data = db.export();
  writeFileSync(dbPath, data);
}

export async function initDatabase() {
  await initDB();
  
  // Activer les clés étrangères
  exec('PRAGMA foreign_keys = ON');

  // Table des utilisateurs (clients, chauffeurs, admins)
  exec(`
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
  exec(`
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
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  // Table des courses
  exec(`
    CREATE TABLE IF NOT EXISTS rides (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      client_id INTEGER NOT NULL,
      driver_id INTEGER,
      pickup_address TEXT NOT NULL,
      pickup_lat REAL NOT NULL,
      pickup_lng REAL NOT NULL,
      dropoff_address TEXT NOT NULL,
      dropoff_lat REAL NOT NULL,
      dropoff_lng REAL NOT NULL,
      distance REAL,
      duration INTEGER,
      price REAL,
      status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'assigned', 'in_progress', 'completed', 'cancelled')),
      payment_status TEXT DEFAULT 'unpaid' CHECK(payment_status IN ('unpaid', 'paid', 'pending_transfer')),
      rating INTEGER CHECK(rating >= 1 AND rating <= 5),
      comment TEXT,
      route_geometry TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      started_at DATETIME,
      completed_at DATETIME,
      FOREIGN KEY (client_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (driver_id) REFERENCES users(id) ON DELETE SET NULL
    )
  `);

  // Table des paiements/versements
  exec(`
    CREATE TABLE IF NOT EXISTS payments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      driver_id INTEGER NOT NULL,
      amount REAL NOT NULL,
      type TEXT NOT NULL CHECK(type IN ('ride_payment', 'transfer_to_admin')),
      ride_id INTEGER,
      status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'completed', 'cancelled')),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (driver_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (ride_id) REFERENCES rides(id) ON DELETE SET NULL
    )
  `);

  // Table des notifications
  exec(`
    CREATE TABLE IF NOT EXISTS notifications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      title TEXT NOT NULL,
      message TEXT NOT NULL,
      type TEXT DEFAULT 'info' CHECK(type IN ('info', 'success', 'warning', 'error')),
      read INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  // Créer un admin par défaut si aucun n'existe
  const adminExists = get('SELECT id FROM users WHERE role = ?', 'admin');
  
  if (!adminExists) {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    run(
      `INSERT INTO users (name, phone, password, role, city, status)
       VALUES (?, ?, ?, 'admin', 'Kinshasa', 'active')`,
      'Admin TAXIA',
      '+243999999999',
      hashedPassword
    );
    console.log('✅ Compte admin créé : +243999999999 / admin123');
  }

  console.log('✅ Base de données initialisée avec succès');
}

// Exporter les wrappers
export default {
  prepare: (sql) => ({
    run: (...params) => run(sql, ...params),
    get: (...params) => get(sql, ...params),
    all: (...params) => all(sql, ...params)
  }),
  exec,
  pragma: (pragma) => exec(`PRAGMA ${pragma}`)
};
