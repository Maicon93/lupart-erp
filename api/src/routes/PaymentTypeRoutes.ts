import { Router } from 'express';
import PaymentTypeController from '../controllers/PaymentTypeController';
import { validate } from '../middlewares/validationMiddleware';
import { createPaymentTypeSchema, updatePaymentTypeSchema } from '../schemas/PaymentTypeSchema';

const router = Router();
const controller = new PaymentTypeController();

router.get('/', (req, res) => controller.findAll(req as any, res));
router.get('/:id', (req, res) => controller.findById(req as any, res));
router.post('/', validate(createPaymentTypeSchema), (req, res) => controller.create(req as any, res));
router.put('/:id', validate(updatePaymentTypeSchema), (req, res) => controller.update(req as any, res));
router.patch('/:id/toggle-status', (req, res) => controller.toggleStatus(req as any, res));

export default router;
