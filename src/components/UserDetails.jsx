import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getUsers, getTasks, createTask, deleteTask, changeRole, downloadPDF, downloadCSV, getReport } from '../api.js';

const UserDetails = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [progress, setProgress] = useState(0);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch user details
        const { data: usersData } = await getUsers();
        const selectedUser = usersData.find(u => u._id === id);
        if (!selectedUser) {
          setError('No User found');
          return;
        }
        setUser(selectedUser);

        // Fetch user's tasks
        const { data: tasksData } = await getTasks({ assignee: id }); // Pass assignee in query
        console.log('Tasks fetched:', tasksData); // Debug
        setTasks(tasksData);

        // Fetch progress
        const { data: reportData } = await getReport('user', id);
        setProgress(reportData.progress || 0);
      } catch (err) {
        setError(err.response?.data?.error || 'problem to fetch data');
      }
    };
    fetchData();
  }, [id]);

  const handleAssignTask = async () => {
    if (!title) return setError('task title');
    try {
      await createTask({ title, description, deadline, assignee: id });
      // Refresh tasks and progress
      const { data: tasksData } = await getTasks({ assignee: id });
      setTasks(tasksData);
      const { data: reportData } = await getReport('user', id);
      setProgress(reportData.progress || 0);
      setTitle('');
      setDescription('');
      setDeadline('');
      setError('');
    } catch (err) {
      setError(err.response?.data?.error || 'problemt o assign the task');
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!confirm('do you want to delete the task?')) return;
    try {
      await deleteTask(taskId);
      // Refresh tasks and progress
      const { data: tasksData } = await getTasks({ assignee: id });
      setTasks(tasksData);
      const { data: reportData } = await getReport('user', id);
      setProgress(reportData.progress || 0);
      setError('');
    } catch (err) {
      setError(err.response?.data?.error || 'problem to delete the task');
    }
  };

  const handleRoleChange = async () => {
    try {
      const newRole = user.role === 'user' ? 'admin' : 'user';
      await changeRole(id, newRole);
      setUser({ ...user, role: newRole });
      setError('');
    } catch (err) {
      setError(err.response?.data?.error || 'রোল চেঞ্জ করতে সমস্যা');
    }
  };

  const handleDownload = async (format) => {
    try {
      let response;
      if (format === 'pdf') {
        response = await downloadPDF('user', id);
      } else {
        response = await downloadCSV('user', id);
      }
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `user_${id}_progress.${format}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      setError('');
    } catch (err) {
      setError(err.response?.data?.error || 'রিপোর্ট ডাউনলোড করতে সমস্যা');
    }
  };

  if (error && !user) return <div className="p-6 text-red-500">{error}</div>;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-4">User Name: {user?.username || 'Lodding...'}</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {user && (
        <>
          <p className="mb-2">Role: {user.role}</p>
          <button 
            onClick={handleRoleChange} 
            className="mb-4 bg-blue-400 text-white px-2 py-2 rounded hover:bg-blue-600"
          >
            Change the Role ({user.role === 'user' ? ' into admin ' : ' Into user '})
          </button>
          <p className="mb-6">Progress: {progress}%</p>

          <h2 className="text-2xl font-bold mb-4">Assigned List</h2>
          <ul className="space-y-4 mb-6">
            {tasks.length > 0 ? (
              tasks.map(task => (
                <li key={task._id} className="p-4 bg-white rounded shadow flex justify-between items-center">
                  <div>
                    <h3 className="font-bold">{task.title}</h3>
                    <p>Description: {task.description || 'N/A'}</p>
                    <p>Status: {task.status}</p>
                    <p>deadline: {task.deadline ? new Date(task.deadline).toLocaleDateString() : 'N/A'}</p>
                  </div>
                  <button 
                    onClick={() => handleDeleteTask(task._id)} 
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </li>
              ))
            ) : (
              <p>NO task assign</p>
            )}
          </ul>

          <h2 className="text-2xl font-bold mb-4">Assign New Task</h2>
          <input 
            type="text" 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
            placeholder="Title" 
            className="block mb-2 px-3 py-2 border rounded w-full"
          />
          <textarea 
            value={description} 
            onChange={(e) => setDescription(e.target.value)} 
            placeholder="Task description" 
            className="block mb-2 px-3 py-2 border rounded w-full"
          />
          <input 
            type="date" 
            value={deadline} 
            onChange={(e) => setDeadline(e.target.value)} 
            className="block mb-2 px-3 py-2 border rounded w-full"
          />
          <button 
            onClick={handleAssignTask} 
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Assign Task
          </button>

          <h2 className="text-2xl font-bold mt-6 mb-4">Progress Report</h2>
          <button 
            onClick={() => handleDownload('pdf')} 
            className="mr-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            PDF download
          </button>
          <button 
            onClick={() => handleDownload('csv')} 
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            CSV download
          </button>
        </>
      )}
    </div>
  );
};

export default UserDetails;