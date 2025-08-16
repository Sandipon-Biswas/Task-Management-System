import User from '../models/User.js';
import { getIo } from '../utils/socketSingleton.js';

export const getAllUsers = async (req, res) => {
  const users = await User.find().select('-password');
  res.json(users);
};

export const changeRole = async (req, res) => {
  const { role } = req.body;
  const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true });
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json(user);
};

export const getUserProgress = async (req, res) => {
  const user = await User.findById(req.user.id);
  res.json({ progress: user.progress });
};