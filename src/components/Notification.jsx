import { useEffect } from 'react';
import socket from '../socket.js';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Notification = () => {
  useEffect(() => {
    socket.on('connect', () => {
      console.log('Socket connected:', socket.id); // Debug
    });

    socket.on('connect_error', (err) => {
      console.error('Socket connection error:', err.message); // Debug
    });

    socket.on('notification', (data) => {
      console.log('Received notification:', data); // Debug
      toast.info(data.message, {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        toastId: data._id // Prevent duplicate toasts
      });
    });

    return () => {
      socket.off('connect');
      socket.off('connect_error');
      socket.off('notification');
    };
  }, []);

  return <ToastContainer />;
};

export default Notification;