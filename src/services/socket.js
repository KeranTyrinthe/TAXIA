import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';

class SocketService {
  constructor() {
    this.socket = null;
    this.listeners = new Map();
  }

  connect(userId) {
    if (this.socket?.connected) return;

    this.socket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5
    });

    this.socket.on('connect', () => {
      console.log('✅ Socket connecté:', this.socket.id);
      if (userId) {
        this.socket.emit('join', userId);
      }
    });

    this.socket.on('disconnect', () => {
      console.log('❌ Socket déconnecté');
    });

    this.socket.on('error', (error) => {
      console.error('Socket error:', error);
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  on(event, callback) {
    if (!this.socket) return;
    
    this.socket.on(event, callback);
    
    // Stocker pour cleanup
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);
  }

  off(event, callback) {
    if (!this.socket) return;
    
    this.socket.off(event, callback);
    
    // Nettoyer le listener stocké
    if (this.listeners.has(event)) {
      const callbacks = this.listeners.get(event);
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  emit(event, data) {
    if (!this.socket) return;
    this.socket.emit(event, data);
  }

  // Événements spécifiques à TAXIA
  updateLocation(location) {
    this.emit('location_update', location);
  }

  requestRide(rideData) {
    this.emit('ride_request', rideData);
  }

  acceptRide(rideId) {
    this.emit('ride_accept', { rideId });
  }

  declineRide(rideId) {
    this.emit('ride_decline', { rideId });
  }

  startRide(rideId) {
    this.emit('ride_start', { rideId });
  }

  completeRide(rideId) {
    this.emit('ride_complete', { rideId });
  }

  cancelRide(rideId) {
    this.emit('ride_cancel', { rideId });
  }
}

export const socketService = new SocketService();
