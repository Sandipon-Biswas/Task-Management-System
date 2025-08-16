import { useEffect, useState } from 'react';
import socket from '../socket.js';

const ActiveUsers = () => {
  const [activeUsers, setActiveUsers] = useState([]);

  // 
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
    if (!userData) return;

    socket.connect();               // socket connect
    socket.emit('join', userData.id); // s

    socket.on('activeUsers', (users) => {
      setActiveUsers(users);        // server 
    });

    // Cleanup: 
    return () => {
      socket.off('activeUsers');
      socket.disconnect();
    };
  }, []);

  return (
    <div className="p-6">
      <h1>Active Users ({activeUsers.length})</h1>
      <ul>
        {activeUsers.map(u => (
          <li key={u.id}>{u.username}</li>
        ))}
      </ul>
    </div>
  );
};

export default ActiveUsers;

