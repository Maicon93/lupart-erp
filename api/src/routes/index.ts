import { Router } from 'express';
import logger from '../helpers/Logger';
import authRoutes from './AuthRoutes';
import accessPlanRoutes from './AccessPlanRoutes';
import companyRoutes from './CompanyRoutes';
import userRoutes from './UserRoutes';

const router = Router();

router.get('/health', (_request, response) => {
    logger.info('Health check requested');
    response.json({ type: 'success', data: { status: 'ok' } });
});

router.use('/auth', authRoutes);
router.use('/access-plans', accessPlanRoutes);
router.use('/companies', companyRoutes);
router.use('/users', userRoutes);

export default router;
