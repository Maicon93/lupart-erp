import { Router } from 'express';
import SupplierController from '../controllers/SupplierController';
import { validate } from '../middlewares/validationMiddleware';
import { createSupplierSchema, updateSupplierSchema } from '../schemas/SupplierSchema';

const router = Router();
const controller = new SupplierController();

router.get('/', (req, res) => controller.findAll(req as any, res));
router.get('/:id', (req, res) => controller.findById(req as any, res));
router.post('/', validate(createSupplierSchema), (req, res) => controller.create(req as any, res));
router.put('/:id', validate(updateSupplierSchema), (req, res) => controller.update(req as any, res));
router.delete('/:id', (req, res) => controller.remove(req as any, res));

export default router;
