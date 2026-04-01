import { Router, RequestHandler } from 'express';
import CustomerController from '../controllers/CustomerController';
import { validate } from '../middlewares/validationMiddleware';
import { createCustomerSchema, updateCustomerSchema } from '../schemas/CustomerSchema';

const router = Router();

router.get('/', CustomerController.findAll as RequestHandler);
router.get('/:id', CustomerController.findById as RequestHandler);
router.post('/', validate(createCustomerSchema), CustomerController.create as RequestHandler);
router.put('/:id', validate(updateCustomerSchema), CustomerController.update as RequestHandler);
router.delete('/:id', CustomerController.remove as RequestHandler);

export default router;
