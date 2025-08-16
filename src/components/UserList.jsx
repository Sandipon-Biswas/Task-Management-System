import { useEffect, useState } from 'react';
import { getUsers, changeRole } from '../api.js';

const UserList = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const { data } = await getUsers();
      setUsers(data);
    };
    fetchUsers();
  }, []);

  const handleRoleChange = async (id, newRole) => {
    await changeRole(id, newRole);
    // Refresh list
  };

  return (
    <ul>
      {users.map(user => (
        <li key={user._id}>
          {user.username} - Role: {user.role}
          <button onClick={() => handleRoleChange(user._id, user.role === 'user' ? 'admin' : 'user')}>Toggle Role</button>
          {/* Add AssignTask component here for clicking user */}
        </li>
      ))}
    </ul>
  );
};

export default UserList;