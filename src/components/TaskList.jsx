import { useEffect, useState } from 'react';
import { getTasks } from '../api.js';

const TaskList = () => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const fetchTasks = async () => {
      const { data } = await getTasks();
      setTasks(data);
    };
    fetchTasks();
  }, []);

  return (
    <ul>
      {tasks.map(task => (
        <li key={task._id}>{task.title} - Status: {task.status}</li>
      ))}
    </ul>
  );
};

export default TaskList;