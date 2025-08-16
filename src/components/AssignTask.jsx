import { useState } from 'react';
import { createTask } from '../api.js';

const AssignTask = ({ userId }) => {
  const [title, setTitle] = useState('');
  // Other fields: description, deadline, dependencies, project

  const handleAssign = async () => {
    await createTask({ title, assignee: userId /* other fields */ });
  };

  return (
    <form onSubmit={(e) => { e.preventDefault(); handleAssign(); }}>
      <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Task Title" />
      {/* Other inputs */}
      <button>Assign</button>
    </form>
  );
};

export default AssignTask;