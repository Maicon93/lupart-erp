import { Router } from 'express';
import CustomerController from '../controllers/CustomerController';
import { validate } from '../middlewares/validationMiddleware';
import { createCustomerSchema, updateCustomerSchema } from '../schemas/CustomerSchema';

const router = Router();
const controller = new CustomerController();

router.get('/', (req, res) => controller.findAll(req as any, res));
router.get('/:id', (req, res) => controller.findById(req as any, res));
router.post('/', validate(createCustomerSchema), (req, res) => controller.create(req as any, res));
router.put('/:id', validate(updateCustomerSchema), (req, res) => controller.update(req as any, res));
router.delete('/:id', (req, res) => controller.remove(req as any, res));

export default router;
