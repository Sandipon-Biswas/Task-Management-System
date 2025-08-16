import { useEffect, useState } from 'react';
import socket from '../socket.js';

const ActiveUsers = () => {
  const [activeUsers, setActiveUsers] = useState([]);

  useEffect(() => {
    socket.on('activeUsers', (users) => {
      console.log('Active users received:', users); // Debug
      setActiveUsers(users);
    });

    return () => socket.off('activeUsers');
  }, []);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-4">Active User List</h1>
      <p className="mb-4">Total Active Now: {activeUsers.length}</p>
      <ul className="space-y-2">
        {activeUsers.length > 0 ? (
          activeUsers.map(user => (
            <li key={user.id} className="p-2 bg-white rounded shadow">
              User Name: {user.username} ( User ID: {user.id})
            </li>
          ))
        ) : (
          <p>NO user rather than you</p>
        )}
      </ul>
    </div>
  );
};

export default ActiveUsers;