import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true 
  },
  description: { 
    type: String 
  },
  deadline: { 
    type: Date 
  },
  status: { 
    type: String, 
    enum: ['pending', 'in-progress', 'completed'], 
    default: 'pending' 
  },
  assignee: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  dependencies: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Task' // Tasks that this task depends on
  }],
  project: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Project' 
  }
});

// Export the Task model
export default mongoose.model('Task', taskSchema);
