import express from 'express';
import bcrypt from 'bcryptjs';
import { body, validationResult } from 'express-validator';
import db from '../database/init.js';
import { authenticate, authorizeRoles } from '../middleware/auth.js';

const router = express.Router();

// Créer un nouveau chauffeur (Admin uniquement)
router.post('/drivers', authenticate, authorizeRoles('admin'), [
  body('name').trim().notEmpty(),
  body('phone').trim().notEmpty(),
  body('password').isLength({ min: 6 }),
  body('city').trim().notEmpty(),
  body('vehicle_model').trim().notEmpty(),
  body('vehicle_plate').trim().notEmpty()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, phone, password, email, city, vehicle_model, vehicle_plate, license_number } = req.body;

    // Vérifier si le téléphone existe
    const existingUser = db.prepare('SELECT id FROM users WHERE phone = ?').get(phone);
    if (existingUser) {
      return res.status(400).json({ error: 'Ce numéro est déjà utilisé' });
    }

    // Vérifier si la plaque existe
    const existingPlate = db.prepare('SELECT id FROM drivers WHERE vehicle_plate = ?').get(vehicle_plate);
    if (existingPlate) {
      return res.status(400).json({ error: 'Cette plaque est déjà utilisée' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Créer l'utilisateur
    const userResult = db.prepare(`
      INSERT INTO users (name, phone, password, email, role, city)
      VALUES (?, ?, ?, ?, 'driver', ?)
    `).run(name, phone, hashedPassword, email || null, city);

    // Créer le profil chauffeur
    db.prepare(`
      INSERT INTO drivers (user_id, vehicle_model, vehicle_plate, license_number)
      VALUES (?, ?, ?, ?)
    `).run(userResult.lastInsertRowid, vehicle_model, vehicle_plate, license_number || null);

    res.status(201).json({
      message: 'Chauffeur créé avec succès',
      driver: {
        id: userResult.lastInsertRowid,
        name,
        phone,
        vehicle_model,
        vehicle_plate
      }
    });
  } catch (error) {
    console.error('Erreur création chauffeur:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Obtenir tous les chauffeurs
router.get('/drivers', authenticate, authorizeRoles('admin'), (req, res) => {
  try {
    const drivers = db.prepare(`
      SELECT u.id, u.name, u.phone, u.email, u.city, u.status, u.created_at,
             d.vehicle_model, d.vehicle_plate, d.license_number, d.rating, 
             d.total_rides, d.availability, d.balance
      FROM users u
      JOIN drivers d ON u.id = d.user_id
      WHERE u.role = 'driver'
      ORDER BY u.created_at DESC
    `).all();

    res.json({ drivers });
  } catch (error) {
    console.error('Erreur récupération chauffeurs:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Mettre à jour un chauffeur
router.patch('/drivers/:id', authenticate, authorizeRoles('admin'), async (req, res) => {
  try {
    const { name, phone, email, city, vehicle_model, vehicle_plate, status } = req.body;

    const driver = db.prepare('SELECT * FROM users WHERE id = ? AND role = ?').get(req.params.id, 'driver');
    if (!driver) {
      return res.status(404).json({ error: 'Chauffeur non trouvé' });
    }

    // Mettre à jour l'utilisateur
    if (name || phone || email || city || status) {
      const updates = [];
      const values = [];

      if (name) { updates.push('name = ?'); values.push(name); }
      if (phone) { updates.push('phone = ?'); values.push(phone); }
      if (email) { updates.push('email = ?'); values.push(email); }
      if (city) { updates.push('city = ?'); values.push(city); }
      if (status) { updates.push('status = ?'); values.push(status); }

      values.push(req.params.id);

      db.prepare(`
        UPDATE users SET ${updates.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = ?
      `).run(...values);
    }

    // Mettre à jour le profil chauffeur
    if (vehicle_model || vehicle_plate) {
      const updates = [];
      const values = [];

      if (vehicle_model) { updates.push('vehicle_model = ?'); values.push(vehicle_model); }
      if (vehicle_plate) { updates.push('vehicle_plate = ?'); values.push(vehicle_plate); }

      values.push(req.params.id);

      db.prepare(`
        UPDATE drivers SET ${updates.join(', ')} WHERE user_id = ?
      `).run(...values);
    }

    res.json({ message: 'Chauffeur mis à jour' });
  } catch (error) {
    console.error('Erreur mise à jour chauffeur:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Supprimer un chauffeur
router.delete('/drivers/:id', authenticate, authorizeRoles('admin'), (req, res) => {
  try {
    const driver = db.prepare('SELECT * FROM users WHERE id = ? AND role = ?').get(req.params.id, 'driver');
    if (!driver) {
      return res.status(404).json({ error: 'Chauffeur non trouvé' });
    }

    db.prepare('DELETE FROM users WHERE id = ?').run(req.params.id);
    res.json({ message: 'Chauffeur supprimé' });
  } catch (error) {
    console.error('Erreur suppression chauffeur:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Obtenir les statistiques globales
router.get('/stats', authenticate, authorizeRoles('admin'), (req, res) => {
  try {
    const stats = {
      totalRides: db.prepare('SELECT COUNT(*) as count FROM rides').get().count,
      activeRides: db.prepare('SELECT COUNT(*) as count FROM rides WHERE status IN (?, ?)').get('assigned', 'in_progress').count,
      totalDrivers: db.prepare('SELECT COUNT(*) as count FROM users WHERE role = ?').get('driver').count,
      activeDrivers: db.prepare('SELECT COUNT(*) as count FROM drivers WHERE availability = ?').get('available').count,
      totalClients: db.prepare('SELECT COUNT(*) as count FROM users WHERE role = ?').get('client').count,
      todayRevenue: db.prepare('SELECT SUM(price) as total FROM rides WHERE DATE(completed_at) = DATE(?) AND status = ?').get('now', 'completed').total || 0,
      pendingPayments: db.prepare('SELECT SUM(balance) as total FROM drivers').get().total || 0
    };

    res.json({ stats });
  } catch (error) {
    console.error('Erreur récupération stats:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Obtenir les paiements en attente
router.get('/payments', authenticate, authorizeRoles('admin'), (req, res) => {
  try {
    const payments = db.prepare(`
      SELECT u.id, u.name, u.phone, d.balance, d.total_rides,
             COUNT(r.id) as pending_rides
      FROM users u
      JOIN drivers d ON u.id = d.user_id
      LEFT JOIN rides r ON u.id = r.driver_id AND r.payment_status = 'paid'
      WHERE u.role = 'driver' AND d.balance > 0
      GROUP BY u.id
      ORDER BY d.balance DESC
    `).all();

    res.json({ payments });
  } catch (error) {
    console.error('Erreur récupération paiements:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Confirmer un versement
router.post('/payments/:driverId/confirm', authenticate, authorizeRoles('admin'), [
  body('amount').isFloat({ min: 0 })
], (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { amount } = req.body;
    const driverId = req.params.driverId;

    const driver = db.prepare('SELECT balance FROM drivers WHERE user_id = ?').get(driverId);
    if (!driver) {
      return res.status(404).json({ error: 'Chauffeur non trouvé' });
    }

    if (amount > driver.balance) {
      return res.status(400).json({ error: 'Montant supérieur au solde' });
    }

    // Créer l'enregistrement de paiement
    db.prepare(`
      INSERT INTO payments (driver_id, amount, type, status, completed_at)
      VALUES (?, ?, 'transfer_to_admin', 'completed', CURRENT_TIMESTAMP)
    `).run(driverId, amount);

    // Mettre à jour le solde
    db.prepare(`
      UPDATE drivers SET balance = balance - ? WHERE user_id = ?
    `).run(amount, driverId);

    res.json({ message: 'Versement confirmé' });
  } catch (error) {
    console.error('Erreur confirmation versement:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Obtenir les statistiques dashboard (Admin uniquement)
router.get('/statistics', authenticate, authorizeRoles('admin'), async (req, res) => {
  try {
    // Statistiques globales
    const totalRides = db.prepare('SELECT COUNT(*) as count FROM rides').get().count;
    const activeRides = db.prepare('SELECT COUNT(*) as count FROM rides WHERE status IN (?, ?, ?)').get('pending', 'assigned', 'in_progress').count;
    
    const totalDrivers = db.prepare('SELECT COUNT(*) as count FROM users WHERE role = ?').get('driver').count;
    const activeDrivers = db.prepare('SELECT COUNT(*) as count FROM drivers WHERE availability = ?').get('available').count;
    
    const totalClients = db.prepare('SELECT COUNT(*) as count FROM users WHERE role = ?').get('client').count;
    
    const todayRevenue = db.prepare(`
      SELECT SUM(price) as revenue
      FROM rides
      WHERE DATE(created_at) = DATE('now') AND status = 'completed'
    `).get().revenue || 0;
    
    const pendingPayments = db.prepare(`
      SELECT SUM(price) as total
      FROM rides
      WHERE status = 'completed' AND payment_status != 'paid'
    `).get().total || 0;

    // Statistiques détaillées
    const today = db.prepare(`
      SELECT COUNT(*) as rides, SUM(price) as revenue
      FROM rides
      WHERE DATE(completed_at) = DATE('now') AND status = 'completed'
    `).get();
    const week = db.prepare(`
      SELECT COUNT(*) as rides, SUM(price) as revenue
      FROM rides
      WHERE DATE(completed_at) >= DATE('now', '-7 days') AND status = 'completed'
    `).get();
    const month = db.prepare(`
      SELECT COUNT(*) as rides, SUM(price) as revenue
      FROM rides
      WHERE DATE(completed_at) >= DATE('now', '-30 days') AND status = 'completed'
    `).get();

    // Top chauffeurs
    const topDrivers = db.prepare(`
      SELECT u.name, d.total_rides, d.rating
      FROM users u
      JOIN drivers d ON u.id = d.user_id
      WHERE u.role = 'driver'
      ORDER BY d.total_rides DESC
      LIMIT 10
    `).all();

    // Taux de satisfaction
    const satisfaction = db.prepare(`
      SELECT AVG(rating) * 20 as rate
      FROM rides
      WHERE rating IS NOT NULL
    `).get();

    res.json({
      stats: {
        totalRides,
        activeRides,
        totalDrivers,
        activeDrivers,
        totalClients,
        todayRevenue,
        pendingPayments
      },
      today: { rides: today.rides || 0, revenue: today.revenue || 0 },
      week: { rides: week.rides || 0, revenue: week.revenue || 0 },
      month: { rides: month.rides || 0, revenue: month.revenue || 0 },
      topDrivers,
      satisfactionRate: Math.round(satisfaction.rate || 0)
    });
  } catch (error) {
    console.error('Erreur récupération statistiques:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Obtenir toutes les courses (Admin)
router.get('/rides', authenticate, authorizeRoles('admin'), (req, res) => {
  try {
    const rides = db.prepare(`
      SELECT r.*, 
             c.name as client_name, c.phone as client_phone,
             d.name as driver_name, d.phone as driver_phone,
             dr.vehicle_model, dr.vehicle_plate
      FROM rides r
      JOIN users c ON r.client_id = c.id
      LEFT JOIN users d ON r.driver_id = d.id
      LEFT JOIN drivers dr ON d.id = dr.user_id
      ORDER BY r.created_at DESC
    `).all();

    res.json({ rides });
  } catch (error) {
    console.error('Erreur récupération courses:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Définir le prix pour une course manuelle
router.post('/rides/:id/set-price', authenticate, authorizeRoles('admin'), async (req, res) => {
  try {
    const { price } = req.body;
    const rideId = req.params.id;

    // Vérifier que la course existe et est en attente de prix
    const ride = db.prepare('SELECT * FROM rides WHERE id = ?').get(rideId);
    if (!ride) {
      return res.status(404).json({ error: 'Course non trouvée' });
    }

    if (ride.status !== 'waiting_price') {
      return res.status(400).json({ error: 'Cette course n\'est pas en attente de prix' });
    }

    // Mettre à jour le prix et le statut
    db.prepare(`
      UPDATE rides SET price = ?, status = 'price_sent' WHERE id = ?
    `).run(price, rideId);

    // Notifier le client
    const notifyUser = (await import('../services/notifications.js')).notifyUser;
    await notifyUser(
      ride.client_id,
      '💰 Prix proposé',
      `Prix pour votre course: ${price} FC\nDe: ${ride.pickup_address}\nVers: ${ride.dropoff_address}\nValidez ou refusez dans votre interface`
    );

    console.log(`✅ Prix ${price} FC défini pour course #${rideId}`);
    res.json({ message: 'Prix défini avec succès', price });
  } catch (error) {
    console.error('Erreur définition prix:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Assigner un chauffeur avec temps d'arrivée estimé
router.post('/rides/:id/assign-driver', authenticate, authorizeRoles('admin'), async (req, res) => {
  try {
    const { driver_id, estimated_arrival_time } = req.body;
    const rideId = req.params.id;

    // Vérifier que la course existe et que le prix est accepté
    const ride = db.prepare('SELECT * FROM rides WHERE id = ?').get(rideId);
    if (!ride) {
      return res.status(404).json({ error: 'Course non trouvée' });
    }

    if (ride.status !== 'price_accepted') {
      return res.status(400).json({ error: 'Le client doit d\'abord accepter le prix' });
    }

    // Vérifier que le chauffeur existe
    const driver = db.prepare(`
      SELECT u.*, d.vehicle_model, d.vehicle_plate 
      FROM users u 
      JOIN drivers d ON u.id = d.user_id 
      WHERE u.id = ?
    `).get(driver_id);

    if (!driver) {
      return res.status(404).json({ error: 'Chauffeur non trouvé' });
    }

    // Assigner le chauffeur
    db.prepare(`
      UPDATE rides 
      SET driver_id = ?, status = 'assigned', estimated_arrival_time = ? 
      WHERE id = ?
    `).run(driver_id, estimated_arrival_time, rideId);

    // Mettre à jour la disponibilité du chauffeur
    db.prepare(`
      UPDATE drivers SET availability = 'busy' WHERE user_id = ?
    `).run(driver_id);

    // Notifier le chauffeur
    const notifyUser = (await import('../services/notifications.js')).notifyUser;
    await notifyUser(
      driver_id,
      '🚗 Nouvelle course assignée',
      `De: ${ride.pickup_address}\nVers: ${ride.dropoff_address}\nPrix: ${ride.price} FC\nTemps estimé: ${estimated_arrival_time} min`
    );

    // Notifier le client
    await notifyUser(
      ride.client_id,
      '✅ Chauffeur assigné',
      `Chauffeur: ${driver.name}\nVéhicule: ${driver.vehicle_model} (${driver.vehicle_plate})\nArrivée estimée: ${estimated_arrival_time} min`
    );

    console.log(`✅ Chauffeur ${driver.name} assigné à course #${rideId} (ETA: ${estimated_arrival_time}min)`);
    res.json({ 
      message: 'Chauffeur assigné avec succès', 
      driver: driver.name,
      estimated_arrival_time 
    });
  } catch (error) {
    console.error('Erreur assignation chauffeur:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Obtenir tous les utilisateurs (Admin uniquement)
router.get('/users', authenticate, authorizeRoles('admin'), (req, res) => {
  try {
    const users = db.prepare(`
      SELECT 
        u.id, u.name, u.phone, u.email, u.role, u.city, u.status, u.created_at,
        d.vehicle_model, d.vehicle_plate, d.license_number, d.availability
      FROM users u
      LEFT JOIN drivers d ON u.id = d.user_id
      WHERE u.role != 'admin'
      ORDER BY u.created_at DESC
    `).all();

    res.json({ users });
  } catch (error) {
    console.error('Erreur récupération utilisateurs:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

export default router;
