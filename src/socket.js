// socket.js
import { io } from 'socket.io-client';

// Backend URL 
const socket = io('https://task-management-system-4xxe.onrender.com', {
  autoConnect: false, 
});

export default socket;