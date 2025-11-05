import express from 'express';
import bcrypt from 'bcryptjs';
import { body, validationResult } from 'express-validator';
import db from '../database/init.js';
import { authenticate } from '../middleware/auth.js';
import { getNotifications, markAsRead } from '../services/notifications.js';

const router = express.Router();

// Obtenir le profil de l'utilisateur connecté
router.get('/profile', authenticate, (req, res) => {
  try {
    let user;
    
    if (req.user.role === 'driver') {
      user = db.prepare(`
        SELECT u.*, d.vehicle_model, d.vehicle_plate, d.rating, d.total_rides, d.availability, d.balance
        FROM users u
        JOIN drivers d ON u.id = d.user_id
        WHERE u.id = ?
      `).get(req.user.userId);
    } else {
      user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.user.userId);
    }

    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }

    const { password, ...userWithoutPassword } = user;
    res.json({ user: userWithoutPassword });
  } catch (error) {
    console.error('Erreur récupération profil:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Mettre à jour le profil
router.patch('/profile', authenticate, [
  body('name').optional().trim().notEmpty(),
  body('email').optional().isEmail(),
  body('city').optional().trim().notEmpty()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, city, photo } = req.body;
    const updates = [];
    const values = [];

    if (name) { updates.push('name = ?'); values.push(name); }
    if (email) { updates.push('email = ?'); values.push(email); }
    if (city) { updates.push('city = ?'); values.push(city); }
    if (photo) { updates.push('photo = ?'); values.push(photo); }

    if (updates.length === 0) {
      return res.status(400).json({ error: 'Aucune donnée à mettre à jour' });
    }

    values.push(req.user.userId);

    db.prepare(`
      UPDATE users SET ${updates.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = ?
    `).run(...values);

    // Récupérer l'utilisateur mis à jour
    const updatedUser = db.prepare('SELECT * FROM users WHERE id = ?').get(req.user.userId);
    const { password: _, ...userWithoutPassword } = updatedUser;

    res.json({ 
      message: 'Profil mis à jour',
      user: userWithoutPassword
    });
  } catch (error) {
    console.error('Erreur mise à jour profil:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Changer le mot de passe
router.patch('/password', authenticate, [
  body('currentPassword').notEmpty(),
  body('newPassword').isLength({ min: 6 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { currentPassword, newPassword } = req.body;

    const user = db.prepare('SELECT password FROM users WHERE id = ?').get(req.user.userId);
    
    const isValidPassword = await bcrypt.compare(currentPassword, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Mot de passe actuel incorrect' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    db.prepare('UPDATE users SET password = ? WHERE id = ?').run(hashedPassword, req.user.userId);

    res.json({ message: 'Mot de passe modifié' });
  } catch (error) {
    console.error('Erreur changement mot de passe:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Obtenir les notifications
router.get('/notifications', authenticate, (req, res) => {
  try {
    const notifications = getNotifications(req.user.userId);
    res.json({ notifications });
  } catch (error) {
    console.error('Erreur récupération notifications:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Marquer une notification comme lue
router.patch('/notifications/:id/read', authenticate, (req, res) => {
  try {
    markAsRead(req.params.id, req.user.userId);
    res.json({ message: 'Notification marquée comme lue' });
  } catch (error) {
    console.error('Erreur marquage notification:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

export default router;
