import { Router } from 'express';
import ProductController from '../controllers/ProductController';
import { validate } from '../middlewares/validationMiddleware';
import { createProductSchema, updateProductSchema } from '../schemas/ProductSchema';

const router = Router();
const controller = new ProductController();

router.get('/', (req, res) => controller.findAll(req as any, res));
router.get('/:id', (req, res) => controller.findById(req as any, res));
router.post('/', validate(createProductSchema), (req, res) => controller.create(req as any, res));
router.put('/:id', validate(updateProductSchema), (req, res) => controller.update(req as any, res));
router.patch('/:id/toggle-status', (req, res) => controller.toggleStatus(req as any, res));

export default router;
