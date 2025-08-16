import { useEffect, useState } from 'react';
import { getNotifications, markAsRead } from '../api.js';

const NotificationHistory = () => {
  const [notifications, setNotifications] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const { data } = await getNotifications();
        console.log('Notifications fetched:', data); // Debug
        setNotifications(data);
        setError('');
      } catch (err) {
        setError(err.response?.data?.error || 'problem ');
      }
    };
    fetchNotifications();
  }, []);

  const handleMarkRead = async (id) => {
    try {
      await markAsRead(id);
      setNotifications(notifications.map(n => n._id === id ? { ...n, read: true } : n));
      setError('');
    } catch (err) {
      setError(err.response?.data?.error || 'there is a problem');
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-4">Notifications History</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <ul className="space-y-4">
        {notifications.length > 0 ? (
          notifications.map(notif => (
            <li key={notif._id} className={`p-4 rounded shadow ${notif.read ? 'bg-gray-100' : 'bg-white'}`}>
              <p className="font-bold">{notif.message}</p>
              <p>Data: {notif.data ? JSON.stringify(notif.data) : 'N/A'}</p>
              <p>Date: {new Date(notif.createdAt).toLocaleString()}</p>
              {!notif.read && (
                <button 
                  onClick={() => handleMarkRead(notif._id)} 
                  className="mt-2 text-blue-500 hover:underline"
                >
                  Read
                </button>
              )}
            </li>
          ))
        ) : (
          <p>No Notification yet</p>
        )}
      </ul>
    </div>
  );
};

export default NotificationHistory;