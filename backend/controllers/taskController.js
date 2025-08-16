import Task from '../models/Task.js';
import User from '../models/User.js';
import Project from '../models/Project.js';
import { getIo } from '../utils/socketSingleton.js';  // Singleton for Socket.io
import Notification from '../models/Notification.js';

export const getAssignedTasks = async (req, res) => {
  try {
    const { assignee } = req.query;
    let filter = {};
    if (assignee) {
      filter.assignee = assignee; // Filter by assignee ID
    } else if (req.user) {
      filter.assignee = req.user.id; // Fallback to current user
    }
    const tasks = await Task.find(filter).populate('assignee dependencies project');
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
export const getTaskDetails = async (req, res) => {
  const task = await Task.findById(req.params.id).populate('assignee dependencies');
  if (!task) return res.status(404).json({ error: 'Task not found' });
  res.json(task);
};

export const updateTaskStatus = async (req, res) => {
  const { status } = req.body;
  const task = await Task.findById(req.params.id);
  if (!task) return res.status(404).json({ error: 'Task not found' });
  if (task.assignee.toString() !== req.user.id) return res.status(403).json({ error: 'Not authorized' });

  // Check dependencies
  const deps = await Task.find({ _id: { $in: task.dependencies } });
  if (status === 'in-progress' && deps.some(dep => dep.status !== 'completed')) {
    return res.status(400).json({ error: 'Dependencies not completed' });
  }

  task.status = status;
  await task.save();

  // Update user progress
  const user = await User.findById(task.assignee);
  const userTasks = await Task.find({ assignee: user._id });
  user.progress = (userTasks.filter(t => t.status === 'completed').length / userTasks.length) * 100 || 0;
  await user.save();

  // Real-time notification
  const io = getIo();
  io.to(task.assignee.toString()).emit('taskUpdated', task);

  res.json(task);
};



export const editTask = async (req, res) => {
  const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!task) return res.status(404).json({ error: 'Task not found' });

  const io = getIo();
  io.to(task.assignee.toString()).emit('taskUpdated', task);

  res.json(task);
};

export const deleteTask = async (req, res) => {
  const task = await Task.findByIdAndDelete(req.params.id);
  if (!task) return res.status(404).json({ error: 'Task not found' });

  // Remove from user and project
  await User.updateMany({}, { $pull: { tasks: task._id } });
  await Project.updateMany({}, { $pull: { tasks: task._id } });

  res.json({ message: 'Task deleted' });
};

export const setTaskDependency = async (req, res) => {
  const { taskId, depId } = req.body;
  await Task.findByIdAndUpdate(taskId, { $push: { dependencies: depId } });
  res.json({ message: 'Dependency set' });
};

export const searchTasks = async (req, res) => {
  const { query, status, project } = req.query;
  let filter = {};
  if (query) filter.title = { $regex: query, $options: 'i' };
  if (status) filter.status = status;
  if (project) filter.project = project;

  const tasks = await Task.find(filter).populate('assignee project');
  res.json(tasks);
};





export const createTask = async (req, res) => {
  const { title, description, deadline, assignee, dependencies, project } = req.body;
  try {
    const task = new Task({ title, description, deadline, assignee, dependencies, project });
    await task.save();

    await User.findByIdAndUpdate(assignee, { $push: { tasks: task._id } });
    if (project) await Project.findByIdAndUpdate(project, { $push: { tasks: task._id } });

    const notification = new Notification({
      user: assignee,
      message: `New Task Add on You : ${title}`,
      data: { taskId: task._id, title }
    });
    await notification.save();
    console.log('Notification saved:', notification); // Debug

    const io = getIo();
    io.to(assignee).emit('notification', {
      _id: notification._id,
      user: assignee,
      message: notification.message,
      data: notification.data,
      read: notification.read,
      createdAt: notification.createdAt
    });
    console.log('Notification emitted to:', assignee); // Debug

    res.status(201).json(task);
  } catch (err) {
    console.error('Error creating task:', err.message); // Debug
    res.status(400).json({ error: err.message });
  }
};