import { Router } from 'express';
import SaleController from '../controllers/SaleController';
import { validate } from '../middlewares/validationMiddleware';
import { createSaleSchema, cancelSaleSchema } from '../schemas/SaleSchema';

const router = Router();
const controller = new SaleController();

router.get('/', (req, res) => controller.findAll(req as any, res));
router.get('/:id', (req, res) => controller.findById(req as any, res));
router.get('/:id/payment', (req, res) => controller.findPayment(req as any, res));
router.post('/', validate(createSaleSchema), (req, res) => controller.create(req as any, res));
router.post('/:id/cancel', validate(cancelSaleSchema), (req, res) => controller.cancel(req as any, res));

export default router;
