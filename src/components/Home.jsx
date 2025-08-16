import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext.jsx';
import UserDashboard from './UserDashboard.jsx';
import AdminDashboard from './AdminDashboard.jsx';

const Home = () => {
  const { user } = useContext(AuthContext);

  if (!user) return null;

  return user.role === 'admin' ? <AdminDashboard /> : <UserDashboard />;
};

export default Home;