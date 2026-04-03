import { Router } from 'express';
import CategoryController from '../controllers/CategoryController';
import { validate } from '../middlewares/validationMiddleware';
import { createCategorySchema, updateCategorySchema } from '../schemas/CategorySchema';

const router = Router();
const controller = new CategoryController();

router.get('/', (req, res) => controller.findAll(req as any, res));
router.get('/:id', (req, res) => controller.findById(req as any, res));
router.post('/', validate(createCategorySchema), (req, res) => controller.create(req as any, res));
router.put('/:id', validate(updateCategorySchema), (req, res) => controller.update(req as any, res));
router.patch('/:id/toggle-status', (req, res) => controller.toggleStatus(req as any, res));
router.delete('/:id', (req, res) => controller.remove(req as any, res));

export default router;
