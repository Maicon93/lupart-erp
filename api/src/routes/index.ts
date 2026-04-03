import { Router } from 'express';
import express from 'express';
import logger from '../helpers/Logger';
import TenantMiddleware from '../middlewares/TenantMiddleware';
import authRoutes from './AuthRoutes';
import accessPlanRoutes from './AccessPlanRoutes';
import companyRoutes from './CompanyRoutes';
import userRoutes from './UserRoutes';
import permissionRoutes from './PermissionRoutes';
import positionRoutes from './PositionRoutes';
import systemConfigurationRoutes from './SystemConfigurationRoutes';
import measurementUnitRoutes from './MeasurementUnitRoutes';
import customerRoutes from './CustomerRoutes';
import supplierRoutes from './SupplierRoutes';
import categoryRoutes from './CategoryRoutes';
import paymentTypeRoutes from './PaymentTypeRoutes';
import productRoutes from './ProductRoutes';
import stockEntryRoutes from './StockEntryRoutes';

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
router.use('/measurement-units', TenantMiddleware.handle as express.RequestHandler, measurementUnitRoutes);
router.use('/customers', TenantMiddleware.handle as express.RequestHandler, customerRoutes);
router.use('/suppliers', TenantMiddleware.handle as express.RequestHandler, supplierRoutes);
router.use('/categories', TenantMiddleware.handle as express.RequestHandler, categoryRoutes);
router.use('/payment-types', TenantMiddleware.handle as express.RequestHandler, paymentTypeRoutes);
router.use('/products', TenantMiddleware.handle as express.RequestHandler, productRoutes);
router.use('/stock-entries', TenantMiddleware.handle as express.RequestHandler, stockEntryRoutes);

export default router;
