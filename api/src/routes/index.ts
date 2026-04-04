import { Router } from 'express';
import logger from '../helpers/Logger';
import { tenantMiddleware } from '../middlewares/TenantMiddleware';
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
import saleRoutes from './SaleRoutes';
import companySettingRoutes from './CompanySettingRoutes';

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
router.use('/measurement-units', tenantMiddleware, measurementUnitRoutes);
router.use('/customers', tenantMiddleware, customerRoutes);
router.use('/suppliers', tenantMiddleware, supplierRoutes);
router.use('/categories', tenantMiddleware, categoryRoutes);
router.use('/payment-types', tenantMiddleware, paymentTypeRoutes);
router.use('/products', tenantMiddleware, productRoutes);
router.use('/stock-entries', tenantMiddleware, stockEntryRoutes);
router.use('/sales', tenantMiddleware, saleRoutes);
router.use('/company-settings', tenantMiddleware, companySettingRoutes);

export default router;
