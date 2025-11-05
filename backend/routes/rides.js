import express from 'express';
import { body, validationResult } from 'express-validator';
import db from '../database/init.js';
import { authenticate, authorizeRoles } from '../middleware/auth.js';
import { calculateRoute, findBestDriver } from '../services/ai.js';
import { notifyUser } from '../services/notifications.js';

const router = express.Router();

const parseRideGeometry = (ride) => {
  if (!ride) return ride;
  if (ride.route_geometry) {
    try {
      ride.route_geometry = JSON.parse(ride.route_geometry);
    } catch (error) {
      ride.route_geometry = null;
    }
  }
  return ride;
};

// Créer une demande de course (Client)
router.post('/', authenticate, authorizeRoles('client'), [
  body('pickup_address').notEmpty(),
  body('pickup_lat').optional({ nullable: true }).isFloat(),
  body('pickup_lng').optional({ nullable: true }).isFloat(),
  body('dropoff_address').notEmpty(),
  body('dropoff_lat').optional({ nullable: true }).isFloat(),
  body('dropoff_lng').optional({ nullable: true }).isFloat()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      pickup_address,
      pickup_lat,
      pickup_lng,
      dropoff_address,
      dropoff_lat,
      dropoff_lng,
      manual_mode
    } = req.body;

    let route = null;
    let result;

    // MODE MANUEL : Pas de calcul automatique
    if (manual_mode) {
      console.log('📝 Mode manuel activé - Course sans calcul automatique');
      
      // Créer la course sans calcul (admin définira le prix)
      result = db.prepare(`
        INSERT INTO rides (
          client_id, pickup_address, pickup_lat, pickup_lng,
          dropoff_address, dropoff_lat, dropoff_lng,
          distance, duration, price, status, route_geometry
        ) VALUES (?, ?, ?, ?, ?, ?, ?, NULL, NULL, NULL, 'waiting_price', NULL)
      `).run(
        req.user.userId,
        pickup_address,
        pickup_lat || null,
        pickup_lng || null,
        dropoff_address,
        dropoff_lat || null,
        dropoff_lng || null
      );

      // Notifier les admins pour définir le prix
      const admins = db.prepare('SELECT id FROM users WHERE role = ?').all('admin');
      for (const admin of admins) {
        await notifyUser(
          admin.id, 
          '💰 Nouvelle demande - Définir prix', 
          `De: ${pickup_address}\nVers: ${dropoff_address}\n⚠️ Veuillez définir le prix`
        );
      }

      console.log(`✅ Course manuelle #${result.lastInsertRowid} créée - En attente du prix admin`);
    } 
    // MODE IA : Calcul automatique
    else {
      console.log('🤖 Mode IA activé - Calcul automatique');
      
      // Calculer l'itinéraire avec l'IA
      route = await calculateRoute(
        { lat: pickup_lat, lng: pickup_lng },
        { lat: dropoff_lat, lng: dropoff_lng }
      );

      // Créer la course
      result = db.prepare(`
        INSERT INTO rides (
          client_id, pickup_address, pickup_lat, pickup_lng,
          dropoff_address, dropoff_lat, dropoff_lng,
          distance, duration, price, status, route_geometry
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', ?)
      `).run(
        req.user.userId,
        pickup_address,
        pickup_lat,
        pickup_lng,
        dropoff_address,
        dropoff_lat,
        dropoff_lng,
        route.distance,
        route.duration,
        route.price,
        JSON.stringify(route.geometry)
      );

      // Notifier tous les admins de la nouvelle commande
      const admins = db.prepare('SELECT id FROM users WHERE role = ?').all('admin');
      for (const admin of admins) {
        await notifyUser(
          admin.id, 
          '🚕 Nouvelle commande', 
          `Course de ${pickup_address} vers ${dropoff_address} - ${route.distance}km - ${route.price}FC`
        );
      }

      // Trouver le meilleur chauffeur avec l'IA
      const bestDriver = await findBestDriver(pickup_lat, pickup_lng);

      if (bestDriver) {
        // Assigner automatiquement
        db.prepare(`
          UPDATE rides SET driver_id = ?, status = 'assigned' WHERE id = ?
        `).run(bestDriver.id, result.lastInsertRowid);

        // Notifier le chauffeur
        await notifyUser(
          bestDriver.id, 
          '🚗 Nouvelle course assignée', 
          `De ${pickup_address} vers ${dropoff_address} - ${route.distance}km - ${route.price}FC`
        );

        // Notifier l'admin de l'attribution
        for (const admin of admins) {
          await notifyUser(
            admin.id,
            '✅ Chauffeur assigné',
            `${bestDriver.name} (${bestDriver.vehicle_model} - ${bestDriver.vehicle_plate}) assigné à ${bestDriver.distance}km du client`
          );
        }

        // Mettre à jour la disponibilité
        db.prepare(`
          UPDATE drivers SET availability = 'busy' WHERE user_id = ?
        `).run(bestDriver.id);

        console.log(`✅ Course #${result.lastInsertRowid} assignée à ${bestDriver.name}`);
      } else {
        console.log(`⚠️ Course #${result.lastInsertRowid} créée mais aucun chauffeur disponible`);
        console.log(`📍 Position pickup: [${pickup_lat}, ${pickup_lng}]`);
        
        // Notifier l'admin qu'aucun chauffeur n'est disponible
      for (const admin of admins) {
        await notifyUser(
          admin.id,
          '⚠️ Aucun chauffeur disponible',
          `Course #${result.lastInsertRowid} en attente d'attribution`
        );
        }
        console.log(`⚠️ Course #${result.lastInsertRowid} créée mais aucun chauffeur disponible`);
      }
    } // Fin du bloc else (mode IA)

    // Récupérer la course créée
    console.log('🔍 Récupération course ID:', result.lastInsertRowid);
    
    let ride = db.prepare(`
      SELECT r.*, u.name as client_name, u.phone as client_phone,
             d.name as driver_name, d.phone as driver_phone,
             dr.vehicle_model, dr.vehicle_plate
      FROM rides r
      JOIN users u ON r.client_id = u.id
      LEFT JOIN users d ON r.driver_id = d.id
      LEFT JOIN drivers dr ON d.id = dr.user_id
      WHERE r.id = ?
    `).get(result.lastInsertRowid);

    console.log('🔍 Course récupérée:', ride);

    ride = parseRideGeometry(ride);

    console.log('🔍 Course après parsing:', ride);

    res.status(201).json({
      message: 'Course créée avec succès',
      ride
    });
  } catch (error) {
    console.error('Erreur création course:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Obtenir les courses d'un client
router.get('/my-rides', authenticate, authorizeRoles('client'), (req, res) => {
  try {
    const rides = db.prepare(`
      SELECT r.*, 
             d.name as driver_name, d.phone as driver_phone,
             dr.vehicle_model, dr.vehicle_plate, dr.rating as driver_rating
      FROM rides r
      LEFT JOIN users d ON r.driver_id = d.id
      LEFT JOIN drivers dr ON d.id = dr.user_id
      WHERE r.client_id = ?
      ORDER BY r.created_at DESC
    `).all(req.user.userId).map(parseRideGeometry);

    res.json({ rides });
  } catch (error) {
    console.error('Erreur récupération courses:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Obtenir les courses d'un chauffeur
router.get('/driver-rides', authenticate, authorizeRoles('driver'), (req, res) => {
  try {
    const rides = db.prepare(`
      SELECT r.*, 
             u.name as client_name, u.phone as client_phone
      FROM rides r
      JOIN users u ON r.client_id = u.id
      WHERE r.driver_id = ?
      ORDER BY r.created_at DESC
    `).all(req.user.userId).map(parseRideGeometry);

    res.json({ rides });
  } catch (error) {
    console.error('Erreur récupération courses chauffeur:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Obtenir la course active d'un client
router.get('/active', authenticate, authorizeRoles('client'), (req, res) => {
  try {
    const ride = db.prepare(`
      SELECT r.*, 
             d.name as driver_name, d.phone as driver_phone,
             dr.vehicle_model, dr.vehicle_plate
      FROM rides r
      LEFT JOIN users d ON r.driver_id = d.id
      LEFT JOIN drivers dr ON d.id = dr.user_id
      WHERE r.client_id = ? AND r.status IN ('pending', 'assigned', 'in_progress')
      ORDER BY r.created_at DESC
      LIMIT 1
    `).get(req.user.userId);

    res.json({ ride: parseRideGeometry(ride) });
  } catch (error) {
    console.error('Erreur récupération course active client:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Obtenir les courses assignées à un chauffeur (en attente de démarrage)
router.get('/assigned', authenticate, authorizeRoles('driver'), (req, res) => {
  try {
    const rides = db.prepare(`
      SELECT r.*, u.name as client_name, u.phone as client_phone
      FROM rides r
      JOIN users u ON r.client_id = u.id
      WHERE r.driver_id = ? AND r.status IN ('assigned', 'pending')
      ORDER BY r.created_at DESC
    `).all(req.user.userId).map(parseRideGeometry);

    res.json({ rides });
  } catch (error) {
    console.error('Erreur récupération courses assignées chauffeur:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Refuser une course (Chauffeur)
router.patch('/:id/decline', authenticate, authorizeRoles('driver'), async (req, res) => {
  try {
    const ride = db.prepare('SELECT * FROM rides WHERE id = ? AND driver_id = ?')
      .get(req.params.id, req.user.userId);

    if (!ride) {
      return res.status(404).json({ error: 'Course non trouvée' });
    }

    if (!['assigned', 'pending'].includes(ride.status)) {
      return res.status(400).json({ error: 'Course non déclinable' });
    }

    db.prepare(`
      UPDATE rides SET driver_id = NULL, status = 'pending'
      WHERE id = ?
    `).run(req.params.id);

    db.prepare(`
      UPDATE drivers SET availability = 'available' WHERE user_id = ?
    `).run(req.user.userId);

    res.json({ message: 'Course déclinée' });
  } catch (error) {
    console.error('Erreur refus course chauffeur:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Démarrer une course (Chauffeur)
router.patch('/:id/start', authenticate, authorizeRoles('driver'), async (req, res) => {
  try {
    const ride = db.prepare('SELECT * FROM rides WHERE id = ? AND driver_id = ?')
      .get(req.params.id, req.user.userId);

    if (!ride) {
      return res.status(404).json({ error: 'Course non trouvée' });
    }

    if (ride.status !== 'assigned') {
      return res.status(400).json({ error: 'Course déjà démarrée ou terminée' });
    }

    db.prepare(`
      UPDATE rides 
      SET status = 'in_progress', started_at = CURRENT_TIMESTAMP 
      WHERE id = ?
    `).run(req.params.id);

    // Notifier le client
    await notifyUser(ride.client_id, 'Course démarrée', 'Votre chauffeur a démarré la course');

    res.json({ message: 'Course démarrée' });
  } catch (error) {
    console.error('Erreur démarrage course:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Terminer une course (Chauffeur)
router.patch('/:id/complete', authenticate, authorizeRoles('driver'), async (req, res) => {
  try {
    const ride = db.prepare('SELECT * FROM rides WHERE id = ? AND driver_id = ?')
      .get(req.params.id, req.user.userId);

    if (!ride) {
      return res.status(404).json({ error: 'Course non trouvée' });
    }

    if (ride.status !== 'in_progress') {
      return res.status(400).json({ error: 'Course non démarrée' });
    }

    db.prepare(`
      UPDATE rides 
      SET status = 'completed', completed_at = CURRENT_TIMESTAMP, payment_status = 'paid'
      WHERE id = ?
    `).run(req.params.id);

    // Mettre à jour les stats du chauffeur
    db.prepare(`
      UPDATE drivers 
      SET total_rides = total_rides + 1, 
          balance = balance + ?,
          availability = 'available'
      WHERE user_id = ?
    `).run(ride.price, req.user.userId);

    // Créer un enregistrement de paiement
    db.prepare(`
      INSERT INTO payments (driver_id, amount, type, ride_id, status)
      VALUES (?, ?, 'ride_payment', ?, 'completed')
    `).run(req.user.userId, ride.price, req.params.id);

    // Notifier le client
    await notifyUser(ride.client_id, 'Course terminée', 'Votre course est terminée. Merci !');

    res.json({ message: 'Course terminée' });
  } catch (error) {
    console.error('Erreur fin course:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Évaluer une course (Client)
router.patch('/:id/rate', authenticate, authorizeRoles('client'), [
  body('rating').isInt({ min: 1, max: 5 }),
  body('comment').optional()
], (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { rating, comment } = req.body;

    const ride = db.prepare('SELECT * FROM rides WHERE id = ? AND client_id = ?')
      .get(req.params.id, req.user.userId);

    if (!ride) {
      return res.status(404).json({ error: 'Course non trouvée' });
    }

    if (ride.status !== 'completed') {
      return res.status(400).json({ error: 'Course non terminée' });
    }

    db.prepare(`
      UPDATE rides SET rating = ?, comment = ? WHERE id = ?
    `).run(rating, comment || null, req.params.id);

    // Mettre à jour la note moyenne du chauffeur
    const avgRating = db.prepare(`
      SELECT AVG(rating) as avg FROM rides WHERE driver_id = ? AND rating IS NOT NULL
    `).get(ride.driver_id);

    db.prepare(`
      UPDATE drivers SET rating = ? WHERE user_id = ?
    `).run(avgRating.avg, ride.driver_id);

    res.json({ message: 'Évaluation enregistrée' });
  } catch (error) {
    console.error('Erreur évaluation:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Annuler une course (Client)
router.patch('/:id/cancel', authenticate, authorizeRoles('client'), async (req, res) => {
  try {
    const ride = db.prepare('SELECT * FROM rides WHERE id = ? AND client_id = ?')
      .get(req.params.id, req.user.userId);

    if (!ride) {
      return res.status(404).json({ error: 'Course non trouvée' });
    }

    if (ride.status === 'in_progress' || ride.status === 'completed') {
      return res.status(400).json({ error: 'Impossible d\'annuler cette course' });
    }

    db.prepare(`
      UPDATE rides SET status = 'cancelled' WHERE id = ?
    `).run(req.params.id);

    // Libérer le chauffeur si assigné
    if (ride.driver_id) {
      db.prepare(`
        UPDATE drivers SET availability = 'available' WHERE user_id = ?
      `).run(ride.driver_id);

      await notifyUser(ride.driver_id, 'Course annulée', 'Le client a annulé la course');
    }

    res.json({ message: 'Course annulée' });
  } catch (error) {
    console.error('Erreur annulation:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Accepter le prix proposé par l'admin (Mode manuel)
router.post('/:id/accept-price', authenticate, authorizeRoles('client'), async (req, res) => {
  try {
    const ride = db.prepare('SELECT * FROM rides WHERE id = ? AND client_id = ?')
      .get(req.params.id, req.user.userId);

    if (!ride) {
      return res.status(404).json({ error: 'Course non trouvée' });
    }

    if (ride.status !== 'price_sent') {
      return res.status(400).json({ error: 'Aucun prix en attente de validation' });
    }

    // Mettre à jour le statut
    db.prepare(`UPDATE rides SET status = 'price_accepted' WHERE id = ?`).run(req.params.id);

    // Notifier l'admin
    const notifyUser = (await import('../services/notifications.js')).notifyUser;
    const admins = db.prepare('SELECT id FROM users WHERE role = ?').all('admin');
    for (const admin of admins) {
      await notifyUser(
        admin.id,
        '✅ Prix accepté',
        `Course #${req.params.id}\nClient a accepté le prix de ${ride.price} FC\nAssignez maintenant un chauffeur`
      );
    }

    console.log(`✅ Client a accepté le prix de ${ride.price} FC pour course #${req.params.id}`);
    res.json({ message: 'Prix accepté', status: 'price_accepted' });
  } catch (error) {
    console.error('Erreur acceptation prix:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Refuser le prix proposé par l'admin (Mode manuel)
router.post('/:id/reject-price', authenticate, authorizeRoles('client'), async (req, res) => {
  try {
    const ride = db.prepare('SELECT * FROM rides WHERE id = ? AND client_id = ?')
      .get(req.params.id, req.user.userId);

    if (!ride) {
      return res.status(404).json({ error: 'Course non trouvée' });
    }

    if (ride.status !== 'price_sent') {
      return res.status(400).json({ error: 'Aucun prix en attente de validation' });
    }

    // Mettre à jour le statut
    db.prepare(`UPDATE rides SET status = 'price_rejected' WHERE id = ?`).run(req.params.id);

    // Notifier l'admin
    const notifyUser = (await import('../services/notifications.js')).notifyUser;
    const admins = db.prepare('SELECT id FROM users WHERE role = ?').all('admin');
    for (const admin of admins) {
      await notifyUser(
        admin.id,
        '❌ Prix refusé',
        `Course #${req.params.id}\nClient a refusé le prix de ${ride.price} FC`
      );
    }

    console.log(`❌ Client a refusé le prix de ${ride.price} FC pour course #${req.params.id}`);
    res.json({ message: 'Prix refusé', status: 'price_rejected' });
  } catch (error) {
    console.error('Erreur refus prix:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Obtenir toutes les courses (Admin)
router.get('/all', authenticate, authorizeRoles('admin'), (req, res) => {
  try {
    const { status } = req.query;
    
    let query = `
      SELECT r.*, 
             c.name as client_name, c.phone as client_phone,
             d.name as driver_name, d.phone as driver_phone,
             dr.vehicle_model, dr.vehicle_plate
      FROM rides r
      JOIN users c ON r.client_id = c.id
      LEFT JOIN users d ON r.driver_id = d.id
      LEFT JOIN drivers dr ON d.id = dr.user_id
    `;

    if (status) {
      query += ` WHERE r.status = ?`;
    }

    query += ` ORDER BY r.created_at DESC`;

    const rides = status 
      ? db.prepare(query).all(status)
      : db.prepare(query).all();

    res.json({ rides: rides.map(parseRideGeometry) });
  } catch (error) {
    console.error('Erreur récupération toutes courses:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

export default router;
