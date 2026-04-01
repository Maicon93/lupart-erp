import { Router } from 'express';
import express from 'express';
import logger from '../helpers/Logger';
import tenantMiddleware from '../middlewares/TenantMiddleware';
import authRoutes from './AuthRoutes';
import accessPlanRoutes from './AccessPlanRoutes';
import companyRoutes from './CompanyRoutes';
import userRoutes from './UserRoutes';
import permissionRoutes from './PermissionRoutes';
import positionRoutes from './PositionRoutes';
import systemConfigurationRoutes from './SystemConfigurationRoutes';
import measurementUnitRoutes from './MeasurementUnitRoutes';

const router = Router();

router.get('/health', (_request, response) => {
    logger.info('Health check requested');
    response.json({ type: 'success', data: { status: 'ok' } });
});

// Public & admin routes (no tenant required)
router.use('/auth', authRoutes);
router.use('/access-plans', accessPlanRoutes);
router.use('/companies', companyRoutes);
router.use('/users', userRoutes);
router.use('/permissions', permissionRoutes);
router.use('/positions', positionRoutes);
router.use('/system-configurations', systemConfigurationRoutes);

// Tenant routes (require X-Company-ID header)
router.use('/measurement-units', tenantMiddleware as express.RequestHandler, measurementUnitRoutes);

export default router;
