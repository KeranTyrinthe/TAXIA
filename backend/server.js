import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { initDatabase } from './database/init.js';

// Routes
import authRoutes from './routes/auth.js';
import ridesRoutes from './routes/rides.js';
import driversRoutes from './routes/drivers.js';
import adminRoutes from './routes/admin.js';
import userRoutes from './routes/users.js';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.NODE_ENV === 'production' 
      ? 'https://taxia.cd' 
      : 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']
  }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialiser la base de données
initDatabase();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/rides', ridesRoutes);
app.use('/api/drivers', driversRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/users', userRoutes);

// Route de test
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'TAXIA API is running' });
});

// Socket.IO pour les notifications en temps réel
io.on('connection', (socket) => {
  console.log('Client connecté:', socket.id);

  socket.on('join', (userId) => {
    socket.join(`user_${userId}`);
    console.log(`User ${userId} joined room`);
  });

  socket.on('disconnect', () => {
    console.log('Client déconnecté:', socket.id);
  });
});

// Rendre io accessible globalement
app.set('io', io);

// Gestion des erreurs
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Erreur serveur' });
});

const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════╗
║   🚕 TAXIA Backend API Server        ║
║   Port: ${PORT}                        ║
║   Environment: ${process.env.NODE_ENV || 'development'}           ║
║   Database: SQLite                    ║
╚═══════════════════════════════════════╝
  `);
});

export { io };
