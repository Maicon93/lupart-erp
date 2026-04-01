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
import customerRoutes from './CustomerRoutes';

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

// Tenant routes (require company_id from user record)
router.use('/measurement-units', tenantMiddleware as express.RequestHandler, measurementUnitRoutes);
router.use('/customers', tenantMiddleware as express.RequestHandler, customerRoutes);

export default router;
