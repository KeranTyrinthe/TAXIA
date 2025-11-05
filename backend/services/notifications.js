import db from '../database/init.js';

export async function notifyUser(userId, title, message, type = 'info') {
  try {
    db.prepare(`
      INSERT INTO notifications (user_id, title, message, type)
      VALUES (?, ?, ?, ?)
    `).run(userId, title, message, type);

    // TODO: Implémenter l'envoi de notifications push via Socket.IO
    return true;
  } catch (error) {
    console.error('Erreur notification:', error);
    return false;
  }
}

export function getNotifications(userId) {
  return db.prepare(`
    SELECT * FROM notifications 
    WHERE user_id = ? 
    ORDER BY created_at DESC 
    LIMIT 50
  `).all(userId);
}

export function markAsRead(notificationId, userId) {
  return db.prepare(`
    UPDATE notifications 
    SET read = 1 
    WHERE id = ? AND user_id = ?
  `).run(notificationId, userId);
}
