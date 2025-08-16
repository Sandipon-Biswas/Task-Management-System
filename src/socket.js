import io from 'socket.io-client';

const socket = io(import.meta.env.VITE_SOCKET_URL, {
  autoConnect: false,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});

socket.on('connect', () => {
  console.log('Socket connected:', socket.id); // Debug
});

socket.on('connect_error', (err) => {
  console.error('Socket connection error:', err.message); // Debug
});

socket.on('disconnect', () => {
  console.log('Socket disconnected'); // Debug
});

export default socket;