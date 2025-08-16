// index.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import http from 'http';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import userRoutes from './routes/userRoutes.js';
import reportRoutes from './routes/reportRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import { initializeSocket } from './utils/socketSingleton.js'; // ✅ 
import User from './models/User.js';

dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);

// ===== Middleware =====
app.use(cors({ origin: '*', methods: ['GET', 'POST', 'PUT', 'DELETE'], credentials: true }));
app.use(express.json());

// ===== Routes =====
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/users', userRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/notifications', notificationRoutes);

// ===== Initialize Socket.io =====
const io = initializeSocket(server);  // ✅ খুব গুরুত্বপূর্ণ

const activeUsers = new Map();

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join', async (userId) => {
    try {
      socket.userId = userId;
      socket.join(userId);

      const user = await User.findById(userId).select('username');
      if (user) {
        activeUsers.set(userId, { id: userId, username: user.username });
        io.emit('activeUsers', Array.from(activeUsers.values()));
      }
    } catch (err) {
      console.error('Error in join event:', err.message);
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    activeUsers.delete(socket.userId);
    io.emit('activeUsers', Array.from(activeUsers.values()));
  });
});

// ===== Test Route =====
app.get('/', (req, res) => {
  res.send('Hello World');
});

// ===== Start Server =====
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
