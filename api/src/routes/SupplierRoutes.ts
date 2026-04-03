import { Router, RequestHandler } from 'express';
import SupplierController from '../controllers/SupplierController';
import ValidationMiddleware from '../middlewares/validationMiddleware';
import { createSupplierSchema, updateSupplierSchema } from '../schemas/SupplierSchema';

const router = Router();

router.get('/', SupplierController.findAll as RequestHandler);
router.get('/:id', SupplierController.findById as RequestHandler);
router.post('/', ValidationMiddleware.validate(createSupplierSchema), SupplierController.create as RequestHandler);
router.put('/:id', ValidationMiddleware.validate(updateSupplierSchema), SupplierController.update as RequestHandler);
router.delete('/:id', SupplierController.remove as RequestHandler);

export default router;
