import { createContext, useState, useEffect } from 'react';
import { login as loginApi } from '../api.js';
import socket from '../socket.js';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const restoreSession = async () => {
      const token = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');
      if (token && storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
          socket.connect();
          socket.emit('join', parsedUser.id);
          console.log('Socket join emitted for user:', parsedUser.id); // Debug
        } catch (err) {
          console.error('Session restore failed:', err.message);
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      }
      setLoading(false);
    };
    restoreSession();

    return () => {
      socket.disconnect();
      console.log('Socket disconnected'); // Debug
    };
  }, []);

  const login = async (credentials) => {
    const { data } = await loginApi(credentials);
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    setUser(data.user);
    socket.connect();
    socket.emit('join', data.user.id);
    console.log('Socket join emitted for user:', data.user.id); // Debug
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    socket.disconnect();
    console.log('Socket disconnected on logout'); // Debug
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {loading ? <div className="min-h-screen flex items-center justify-center">লোডিং...</div> : children}
    </AuthContext.Provider>
  );
};