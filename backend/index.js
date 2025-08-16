import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import userRoutes from './routes/userRoutes.js';
import reportRoutes from './routes/reportRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import { initializeSocket } from './utils/socketSingleton.js';
import http from 'http';
import User from './models/User.js';

dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);
const io = initializeSocket(server);

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/users', userRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/notifications', notificationRoutes);

const activeUsers = new Map();

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  socket.on('join', async (userId) => {
    try {
      socket.userId = userId;
      socket.join(userId); // Join user-specific room
      const user = await User.findById(userId).select('username');
      if (user) {
        activeUsers.set(userId, { id: userId, username: user.username });
        console.log('Active users:', Array.from(activeUsers.values())); // Debug
        io.emit('activeUsers', Array.from(activeUsers.values()));
      } else {
        console.error('User not found for ID:', userId);
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

app.get('/',(req,res)=>{
  res.send("hello world")
})

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));