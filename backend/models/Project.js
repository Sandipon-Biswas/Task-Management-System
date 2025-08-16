import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  tasks: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Task' 
  }]
});

// Export the Project model
export default mongoose.model('Project', projectSchema);
