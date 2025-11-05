import express from 'express';
import db from '../database/init.js';
import { authenticate, authorizeRoles } from '../middleware/auth.js';

const router = express.Router();

// Obtenir le profil du chauffeur
router.get('/profile', authenticate, authorizeRoles('driver'), (req, res) => {
  try {
    const driver = db.prepare(`
      SELECT u.*, d.vehicle_model, d.vehicle_plate, d.license_number,
             d.rating, d.total_rides, d.availability, d.balance
      FROM users u
      JOIN drivers d ON u.id = d.user_id
      WHERE u.id = ?
    `).get(req.user.userId);

    if (!driver) {
      return res.status(404).json({ error: 'Chauffeur non trouvé' });
    }

    const { password, ...driverWithoutPassword } = driver;
    res.json({ driver: driverWithoutPassword });
  } catch (error) {
    console.error('Erreur récupération profil chauffeur:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Mettre à jour la disponibilité
router.patch('/availability', authenticate, authorizeRoles('driver'), (req, res) => {
  try {
    const { availability } = req.body;

    if (!['available', 'offline'].includes(availability)) {
      return res.status(400).json({ error: 'Statut invalide' });
    }

    db.prepare(`
      UPDATE drivers SET availability = ? WHERE user_id = ?
    `).run(availability, req.user.userId);

    res.json({ message: 'Disponibilité mise à jour', availability });
  } catch (error) {
    console.error('Erreur mise à jour disponibilité:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Obtenir les courses en attente (assignées au chauffeur)
router.get('/pending-rides', authenticate, authorizeRoles('driver'), (req, res) => {
  try {
    const rides = db.prepare(`
      SELECT r.*, u.name as client_name, u.phone as client_phone
      FROM rides r
      JOIN users u ON r.client_id = u.id
      WHERE r.driver_id = ? AND r.status = 'assigned'
      ORDER BY r.created_at DESC
    `).all(req.user.userId);

    res.json({ rides });
  } catch (error) {
    console.error('Erreur récupération courses en attente:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Obtenir la course active
router.get('/active-ride', authenticate, authorizeRoles('driver'), (req, res) => {
  try {
    const ride = db.prepare(`
      SELECT r.*, u.name as client_name, u.phone as client_phone
      FROM rides r
      JOIN users u ON r.client_id = u.id
      WHERE r.driver_id = ? AND r.status = 'in_progress'
      LIMIT 1
    `).get(req.user.userId);

    res.json({ ride: ride || null });
  } catch (error) {
    console.error('Erreur récupération course active:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Accepter une course
router.post('/accept-ride/:rideId', authenticate, authorizeRoles('driver'), (req, res) => {
  try {
    const { rideId } = req.params;

    // Vérifier que la course est bien assignée à ce chauffeur
    const ride = db.prepare('SELECT * FROM rides WHERE id = ? AND driver_id = ? AND status = ?')
      .get(rideId, req.user.userId, 'assigned');

    if (!ride) {
      return res.status(404).json({ error: 'Course non trouvée' });
    }

    // Mettre à jour le statut
    db.prepare('UPDATE rides SET status = ? WHERE id = ?').run('in_progress', rideId);

    res.json({ message: 'Course acceptée' });
  } catch (error) {
    console.error('Erreur acceptation course:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Refuser une course
router.post('/reject-ride/:rideId', authenticate, authorizeRoles('driver'), (req, res) => {
  try {
    const { rideId } = req.params;

    // Vérifier que la course est bien assignée à ce chauffeur
    const ride = db.prepare('SELECT * FROM rides WHERE id = ? AND driver_id = ? AND status = ?')
      .get(rideId, req.user.userId, 'assigned');

    if (!ride) {
      return res.status(404).json({ error: 'Course non trouvée' });
    }

    // Remettre en pending et retirer le chauffeur
    db.prepare('UPDATE rides SET status = ?, driver_id = NULL WHERE id = ?').run('pending', rideId);
    
    // Remettre le chauffeur disponible
    db.prepare('UPDATE drivers SET availability = ? WHERE user_id = ?').run('available', req.user.userId);

    res.json({ message: 'Course refusée' });
  } catch (error) {
    console.error('Erreur refus course:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Obtenir l'historique des paiements
router.get('/payments', authenticate, authorizeRoles('driver'), (req, res) => {
  try {
    const payments = db.prepare(`
      SELECT p.*, r.pickup_address, r.dropoff_address
      FROM payments p
      LEFT JOIN rides r ON p.ride_id = r.id
      WHERE p.driver_id = ?
      ORDER BY p.created_at DESC
    `).all(req.user.userId);

    // Calculer les totaux
    const stats = db.prepare(`
      SELECT 
        SUM(CASE WHEN type = 'ride_payment' THEN amount ELSE 0 END) as total_earned,
        SUM(CASE WHEN type = 'transfer_to_admin' AND status = 'completed' THEN amount ELSE 0 END) as total_transferred
      FROM payments
      WHERE driver_id = ?
    `).get(req.user.userId);

    res.json({ 
      payments,
      stats: {
        total_earned: stats.total_earned || 0,
        total_transferred: stats.total_transferred || 0,
        balance: (stats.total_earned || 0) - (stats.total_transferred || 0)
      }
    });
  } catch (error) {
    console.error('Erreur récupération paiements:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Obtenir les statistiques du chauffeur
router.get('/stats', authenticate, authorizeRoles('driver'), (req, res) => {
  try {
    const stats = db.prepare(`
      SELECT 
        COUNT(*) as total_rides,
        SUM(CASE WHEN DATE(completed_at) = DATE('now') THEN 1 ELSE 0 END) as today_rides,
        SUM(CASE WHEN DATE(completed_at) = DATE('now') THEN price ELSE 0 END) as today_revenue,
        SUM(distance) as total_distance
      FROM rides
      WHERE driver_id = ? AND status = 'completed'
    `).get(req.user.userId);

    const driver = db.prepare(`
      SELECT rating, balance FROM drivers WHERE user_id = ?
    `).get(req.user.userId);

    res.json({
      ...stats,
      rating: driver.rating,
      balance: driver.balance
    });
  } catch (error) {
    console.error('Erreur récupération stats:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

export default router;
