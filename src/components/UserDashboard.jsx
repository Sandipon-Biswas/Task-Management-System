import { useEffect, useState } from 'react';
import { getTasks, updateStatus, getProgress } from '../api.js';
import Notification from './Notification.jsx';
import socket from '../socket.js';

const UserDashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [progress, setProgress] = useState(0);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
    if (!userData) return;
    setUser(userData);

    // Function to fetch tasks & progress
    const fetchTasksAndProgress = async () => {
      const { data: taskData } = await getTasks({ assignee: userData.id });
      setTasks(taskData);

      const { data: progressData } = await getProgress();
      setProgress(progressData.progress);
    };

    // Initial fetch
    fetchTasksAndProgress();

    // Connect the socket
    socket.connect();

    // Optional: join user-specific room
    socket.emit('joinRoom', userData.id);

    // Listen to new notifications
    socket.on('newNotification', (notification) => {
      console.log('New notification received:', notification);
      fetchTasksAndProgress(); // Refresh tasks & progress
    });

    // Cleanup on unmount
    return () => {
      socket.off('newNotification');
      socket.disconnect();
    };
  }, []);

  const handleStatusUpdate = async (id, status) => {
    await updateStatus(id, status);
    const { data } = await getTasks({ assignee: user?.id });
    setTasks(data);
  };

  return (
    <div className="p-6">
      <Notification />
      <h1 className="text-3xl font-bold mb-4">
        User Dashboard {user && `- Welcome, ${user.username}`}
      </h1>
      <p className="mb-6">Progress: {progress}%</p>
      <h2 className="text-2xl mb-2">My Tasks</h2>
      <ul className="space-y-4">
        {tasks.map(task => (
          <li key={task._id} className="p-4 bg-white rounded shadow">
            <h3 className="font-bold">{task.title}</h3>
            <p>Status: {task.status}</p>
            <p>Deadline: {task.deadline ? new Date(task.deadline).toLocaleDateString() : 'N/A'}</p>
            <select
              value={task.status}
              onChange={(e) => handleStatusUpdate(task._id, e.target.value)}
              className="mt-2 px-2 py-1 border rounded"
            >
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserDashboard;
