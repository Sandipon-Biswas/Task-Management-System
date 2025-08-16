import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { adminOnly } from '../middleware/roleMiddleware.js';
import { getProgressReport, generatePDFReport, generateCSVReport } from '../controllers/reportController.js';

const router = express.Router();

router.use(protect, adminOnly);

router.get('/progress', getProgressReport);
router.get('/pdf', generatePDFReport);
router.get('/csv', generateCSVReport);

export default router;