import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './contexts/AuthContext.jsx';
import { useContext } from 'react';
import Login from './components/Login.jsx';
import Register from './components/Register.jsx';
import Home from './components/Home.jsx';
import UserDetails from './components/UserDetails.jsx';
import ActiveUsers from './components/ActiveUsers.jsx';
import NotificationHistory from './components/NotificationHistory.jsx';
import Notification from './components/Notification.jsx';
import Navbar from './components/Navbar.jsx';

function ProtectedRoute({ children }) {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <div className="p-6">লোডিং...</div>;
  return user ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Notification />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/users/:id" element={<ProtectedRoute><UserDetails /></ProtectedRoute>} />
          <Route path="/active-users" element={<ProtectedRoute><ActiveUsers /></ProtectedRoute>} />
          <Route path="/notifications" element={<ProtectedRoute><NotificationHistory /></ProtectedRoute>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;