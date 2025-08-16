import { useEffect, useState } from 'react';
import { getTasks, updateStatus, getProgress } from '../api.js';
import Notification from './Notification.jsx';
import socket from '../socket.js';

const UserDashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [progress, setProgress] = useState(0);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // tasks loading
  const [statusLoading, setStatusLoading] = useState({}); // task-wise loading
  const [error, setError] = useState('');

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
    if (!userData) {
      setError('User not found');
      setIsLoading(false);
      return;
    }
    setUser(userData);

    const fetchTasksAndProgress = async () => {
      try {
        setIsLoading(true);
        const { data: taskData } = await getTasks({ assignee: userData.id });
        setTasks(taskData);

        const { data: progressData } = await getProgress();
        setProgress(progressData.progress);
      } catch (err) {
        setError(err.response?.data?.error || 'Problem fetching tasks');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTasksAndProgress();

    socket.connect();
    socket.emit('joinRoom', userData.id);

    socket.on('newNotification', () => {
      fetchTasksAndProgress();
    });

    return () => {
      socket.off('newNotification');
      socket.disconnect();
    };
  }, []);

  const handleStatusUpdate = async (id, status) => {
    try {
      // Set task-specific loading
      setStatusLoading(prev => ({ ...prev, [id]: true }));
      
      await updateStatus(id, status);
      const { data } = await getTasks({ assignee: user?.id });
      setTasks(data);
      
      const { data: progressData } = await getProgress();
      setProgress(progressData.progress);
    } catch (err) {
      setError(err.response?.data?.error || 'Problem updating status');
    } finally {
      setStatusLoading(prev => ({ ...prev, [id]: false }));
    }
  };

  return (
    <div className="p-6">
      <Notification />
      <h1 className="text-3xl font-bold mb-4">
        User Dashboard {user && `- Welcome, ${user.username}`}
      </h1>
      <p className="mb-6">Progress: {progress}%</p>

      <h2 className="text-2xl mb-2">My Tasks</h2>

      {isLoading && <p>Loading tasks...</p>}
      {error && <p className="text-red-500 mb-4">{error}</p>}

      {!isLoading && !error && (
        <ul className="space-y-4">
          {tasks.length > 0 ? (
            tasks.map(task => (
              <li key={task._id} className="p-4 bg-white rounded shadow">
                <h3 className="font-bold">{task.title}</h3>
                <p>Status: {task.status}</p>
                <p>Deadline: {task.deadline ? new Date(task.deadline).toLocaleDateString() : 'N/A'}</p>
                <select
                  value={task.status}
                  onChange={(e) => handleStatusUpdate(task._id, e.target.value)}
                  className="mt-2 px-2 py-1 border rounded"
                  disabled={statusLoading[task._id]} // block dropdown while updating
                >
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
                {statusLoading[task._id] && <span className="ml-2 text-sm text-gray-500">Updating...</span>}
              </li>
            ))
          ) : (
            <p>No tasks assigned.</p>
          )}
        </ul>
      )}
    </div>
  );
};

export default UserDashboard;
