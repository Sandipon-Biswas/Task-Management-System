import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getUsers } from '../api.js';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // loading state
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        const { data } = await getUsers();
        setUsers(data);
      } catch (err) {
        setError(err.response?.data?.error || 'Problem fetching users');
      } finally {
        setIsLoading(false);
      }
    };
    fetchUsers();
  }, []);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-4">Admin DashBoard</h1>
      <h2 className="text-2xl font-bold mb-2">User List</h2>

      {isLoading && <p>Loading users...</p>} {/* Loading message */}

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {!isLoading && !error && (
        <ul className="space-y-4">
          {users.length > 0 ? (
            users.map(user => (
              <li key={user._id}>
                <Link 
                  to={`/users/${user._id}`} 
                  className="block p-4 bg-white rounded shadow hover:bg-gray-50"
                >
                  {user.username} - Role: {user.role}
                </Link>
              </li>
            ))
          ) : (
            <p>No users found.</p>
          )}
        </ul>
      )}
    </div>
  );
};

export default AdminDashboard;
