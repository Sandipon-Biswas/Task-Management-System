import { getIo } from './socketSingleton.js';

export const sendNotification = (userId, message, data) => {
  const io = getIo();
  io.to(userId).emit('notification', { message, data });
};

// Use in controllers for deadlines, etc.
// Example: For important deadlines, schedule with setTimeout or cron, then call this.