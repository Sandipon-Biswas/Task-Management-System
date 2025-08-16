import { Server } from 'socket.io';

let io;

export const initializeSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "*",  // সব জায়গা থেকে allow
      methods: ["GET", "POST"],
      credentials: true  // যদি cookie / auth দরকার হয়
    }
  });
  return io;
};

export const getIo = () => {
  if (!io) {
    throw new Error('Socket.io not initialized');
  }
  return io;
};
