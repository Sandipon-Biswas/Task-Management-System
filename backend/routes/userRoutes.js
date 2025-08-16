import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { adminOnly } from '../middleware/roleMiddleware.js';
import { getAllUsers, changeRole } from '../controllers/userController.js';
import { getUserProgress } from '../controllers/userController.js';

const router = express.Router();

router.use(protect);

router.get('/progress', getUserProgress);

router.use(adminOnly);
router.get('/', getAllUsers);
router.put('/:id/role', changeRole);

export default router;