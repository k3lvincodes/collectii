
import { Router } from 'express';
import { getSystemHealth, getDashboardMetrics } from '../controllers/systemController';

const router = Router();

router.get('/health', getSystemHealth);
router.get('/metrics', getDashboardMetrics);

export default router;
