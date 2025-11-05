import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';
import { OAuth2Client } from 'google-auth-library';
import db from '../database/init.js';

const router = express.Router();
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Inscription client
router.post('/register', [
  body('name').trim().notEmpty().withMessage('Nom requis'),
  body('phone').trim().notEmpty().withMessage('Téléphone requis'),
  body('password').isLength({ min: 6 }).withMessage('Mot de passe minimum 6 caractères'),
  body('city').trim().notEmpty().withMessage('Ville requise')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, phone, password, city, email } = req.body;

    // Vérifier si l'utilisateur existe
    const existingUser = db.prepare('SELECT id FROM users WHERE phone = ?').get(phone);
    if (existingUser) {
      return res.status(400).json({ error: 'Ce numéro est déjà utilisé' });
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Créer l'utilisateur
    const result = db.prepare(`
      INSERT INTO users (name, phone, password, email, role, city)
      VALUES (?, ?, ?, ?, 'client', ?)
    `).run(name, phone, hashedPassword, email || null, city);

    // Générer le token
    const token = jwt.sign(
      { userId: result.lastInsertRowid, role: 'client' },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.status(201).json({
      message: 'Inscription réussie',
      token,
      user: {
        id: result.lastInsertRowid,
        name,
        phone,
        role: 'client',
        city
      }
    });
  } catch (error) {
    console.error('Erreur inscription:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Connexion
router.post('/login', [
  body('phone').trim().notEmpty().withMessage('Téléphone requis'),
  body('password').notEmpty().withMessage('Mot de passe requis')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { phone, password } = req.body;

    // Trouver l'utilisateur
    const user = db.prepare(`
      SELECT u.*, d.vehicle_model, d.vehicle_plate, d.availability, d.rating
      FROM users u
      LEFT JOIN drivers d ON u.id = d.user_id
      WHERE u.phone = ?
    `).get(phone);

    if (!user) {
      return res.status(401).json({ error: 'Identifiants incorrects' });
    }

    // Vérifier le statut
    if (user.status !== 'active') {
      return res.status(403).json({ error: 'Compte désactivé' });
    }

    // Vérifier le mot de passe
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Identifiants incorrects' });
    }

    // Générer le token
    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    // Retourner les infos utilisateur (sans le mot de passe)
    const { password: _, ...userWithoutPassword } = user;

    res.json({
      message: 'Connexion réussie',
      token,
      user: userWithoutPassword
    });
  } catch (error) {
    console.error('Erreur connexion:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Connexion avec Google OAuth
router.post('/google', async (req, res) => {
  try {
    const { credential } = req.body;

    if (!credential) {
      return res.status(400).json({ error: 'Token Google requis' });
    }

    // Vérifier le token Google
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID
    });

    const payload = ticket.getPayload();
    const { email, name, sub: googleId, picture } = payload;

    // Chercher l'utilisateur par email OU google_id
    let user = db.prepare('SELECT * FROM users WHERE email = ? OR google_id = ?').get(email, googleId);

    if (!user) {
      // Créer un nouveau compte client
      const result = db.prepare(`
        INSERT INTO users (name, email, role, city, status, google_id)
        VALUES (?, ?, 'client', 'Kinshasa', 'active', ?)
      `).run(name, email, googleId);

      user = {
        id: result.lastInsertRowid,
        name,
        email,
        role: 'client',
        city: 'Kinshasa',
        status: 'active',
        google_id: googleId
      };
    } else {
      // Utilisateur existe - vérifier le statut
      if (user.status !== 'active') {
        return res.status(403).json({ error: 'Compte désactivé' });
      }

      // Si l'utilisateur n'a pas encore de google_id, l'ajouter
      if (!user.google_id) {
        db.prepare('UPDATE users SET google_id = ? WHERE id = ?').run(googleId, user.id);
        user.google_id = googleId;
      }
    }

    // Générer le token JWT
    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    const { password: _, ...userWithoutPassword } = user;

    res.json({
      message: 'Connexion Google réussie',
      token,
      user: userWithoutPassword
    });
  } catch (error) {
    console.error('Erreur Google OAuth:', error);
    res.status(500).json({ error: 'Erreur lors de la connexion Google' });
  }
});

export default router;
