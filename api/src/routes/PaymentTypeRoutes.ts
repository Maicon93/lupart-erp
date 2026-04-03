import { Router, RequestHandler } from 'express';
import PaymentTypeController from '../controllers/PaymentTypeController';
import ValidationMiddleware from '../middlewares/validationMiddleware';
import { createPaymentTypeSchema, updatePaymentTypeSchema } from '../schemas/PaymentTypeSchema';

const router = Router();

router.get('/', PaymentTypeController.findAll as RequestHandler);
router.get('/:id', PaymentTypeController.findById as RequestHandler);
router.post('/', ValidationMiddleware.validate(createPaymentTypeSchema), PaymentTypeController.create as RequestHandler);
router.put('/:id', ValidationMiddleware.validate(updatePaymentTypeSchema), PaymentTypeController.update as RequestHandler);
router.patch('/:id/toggle-status', PaymentTypeController.toggleStatus as RequestHandler);

export default router;
