import { Router } from 'express';
import logger from '../helpers/Logger';
import authRoutes from './AuthRoutes';
import accessPlanRoutes from './AccessPlanRoutes';

const router = Router();

router.get('/health', (_request, response) => {
    logger.info('Health check requested');
    response.json({ type: 'success', data: { status: 'ok' } });
});

router.use('/auth', authRoutes);
router.use('/access-plans', accessPlanRoutes);

export default router;
