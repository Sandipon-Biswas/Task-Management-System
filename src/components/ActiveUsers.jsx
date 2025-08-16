import { useEffect, useState } from 'react';
import socket from '../socket.js';

const ActiveUsers = () => {
  const [activeUsers, setActiveUsers] = useState([]);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
    if (!userData) return;

    socket.connect();
    socket.emit('join', userData.id);

    socket.on('activeUsers', (users) => {
      setActiveUsers(users);
    });

    return () => {
      socket.off('activeUsers');
      socket.disconnect();
    };
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-lg font-semibold mb-4">Active Users ({activeUsers.length})</h1>
      <ul className="space-y-2">
        {activeUsers.map(u => (
<li key={u.id} className="flex items-center space-x-2">
  {/* Smaller green circle */}
  <span className="w-2 h-2 bg-green-500 rounded-full block"></span>
  <span>name: {u.username}</span>
</li>
        ))}
      </ul>
    </div>
  );
};

export default ActiveUsers;
