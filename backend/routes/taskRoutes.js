import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { adminOnly } from '../middleware/roleMiddleware.js';
import {
  getAssignedTasks,
  getTaskDetails,
  updateTaskStatus,
  createTask,
  editTask,
  deleteTask,
  setTaskDependency,
  searchTasks
} from '../controllers/taskController.js';

const router = express.Router();

router.use(protect);

router.get('/assigned', getAssignedTasks);
router.get('/:id', getTaskDetails);
router.put('/:id/status', updateTaskStatus);
router.get('/search', searchTasks);

router.use(adminOnly);  // Admin-only below
router.post('/', createTask);
router.put('/:id', editTask);
router.delete('/:id', deleteTask);
router.post('/dependency', setTaskDependency);

export default router;