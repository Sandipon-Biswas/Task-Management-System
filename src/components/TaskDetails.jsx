import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getTask, updateStatus } from '../api.js';

const TaskDetails = () => {
  const { id } = useParams();
  const [task, setTask] = useState(null);
  const [newStatus, setNewStatus] = useState('');

  useEffect(() => {
    const fetchTask = async () => {
      const { data } = await getTask(id);
      setTask(data);
    };
    fetchTask();
  }, [id]);

  const handleUpdate = async () => {
    await updateStatus(id, newStatus);
    // Refresh task
  };

  if (!task) return <div>Loading...</div>;

  return (
    <div>
      <h2>{task.title}</h2>
      <p>Deadline: {task.deadline}</p>
      <p>Status: {task.status}</p>
      <p>Assignee: {task.assignee.username}</p>
      <select value={newStatus} onChange={(e) => setNewStatus(e.target.value)}>
        <option value="pending">Pending</option>
        <option value="in-progress">In Progress</option>
        <option value="completed">Completed</option>
      </select>
      <button onClick={handleUpdate}>Update Status</button>
    </div>
  );
};

export default TaskDetails;