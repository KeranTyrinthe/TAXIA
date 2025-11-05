# TAXIA Backend API

Backend Node.js + SQLite pour la plateforme TAXIA

## 🚀 Installation

```bash
cd backend
npm install
```

## 📝 Configuration

Créer un fichier `.env` :
```
PORT=5000
JWT_SECRET=votre_secret_jwt_super_securise
NODE_ENV=development
```

## ▶️ Démarrage

```bash
# Mode développement
npm run dev

# Mode production
npm start
```

## 📚 API Endpoints

### Authentification
- `POST /api/auth/register` - Inscription client
- `POST /api/auth/login` - Connexion

### Courses
- `POST /api/rides` - Créer une course
- `GET /api/rides/my-rides` - Mes courses (client)
- `GET /api/rides/driver-rides` - Mes courses (chauffeur)
- `PATCH /api/rides/:id/start` - Démarrer une course
- `PATCH /api/rides/:id/complete` - Terminer une course
- `PATCH /api/rides/:id/rate` - Évaluer une course
- `PATCH /api/rides/:id/cancel` - Annuler une course
- `GET /api/rides/all` - Toutes les courses (admin)

### Chauffeurs
- `GET /api/drivers/profile` - Profil chauffeur
- `PATCH /api/drivers/availability` - Changer disponibilité
- `GET /api/drivers/payments` - Historique paiements
- `GET /api/drivers/stats` - Statistiques

### Administration
- `POST /api/admin/drivers` - Créer un chauffeur
- `GET /api/admin/drivers` - Liste des chauffeurs
- `PATCH /api/admin/drivers/:id` - Modifier un chauffeur
- `DELETE /api/admin/drivers/:id` - Supprimer un chauffeur
- `GET /api/admin/stats` - Statistiques globales
- `GET /api/admin/payments` - Paiements en attente
- `POST /api/admin/payments/:driverId/confirm` - Confirmer versement
- `GET /api/admin/statistics` - Statistiques détaillées

### Utilisateurs
- `GET /api/users/profile` - Mon profil
- `PATCH /api/users/profile` - Modifier mon profil
- `PATCH /api/users/password` - Changer mot de passe
- `GET /api/users/notifications` - Mes notifications
- `PATCH /api/users/notifications/:id/read` - Marquer notification lue

## 🔐 Compte Admin par défaut

- **Téléphone**: +243999999999
- **Mot de passe**: admin123

⚠️ **Changez ces identifiants en production !**

## 🗄️ Base de données

SQLite avec les tables :
- `users` - Utilisateurs (clients, chauffeurs, admins)
- `drivers` - Infos supplémentaires chauffeurs
- `rides` - Courses
- `payments` - Paiements et versements
- `notifications` - Notifications
- `settings` - Paramètres système

## 🤖 IA

L'IA calcule automatiquement :
- Distance et durée du trajet
- Prix de la course
- Attribution du meilleur chauffeur disponible

## 📡 WebSocket

Socket.IO pour les notifications en temps réel sur le port du serveur.
