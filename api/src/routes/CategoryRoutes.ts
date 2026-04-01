import { Router, RequestHandler } from 'express';
import CategoryController from '../controllers/CategoryController';
import { validate } from '../middlewares/validationMiddleware';
import { createCategorySchema, updateCategorySchema } from '../schemas/CategorySchema';

const router = Router();

router.get('/', CategoryController.findAll as RequestHandler);
router.get('/:id', CategoryController.findById as RequestHandler);
router.post('/', validate(createCategorySchema), CategoryController.create as RequestHandler);
router.put('/:id', validate(updateCategorySchema), CategoryController.update as RequestHandler);
router.patch('/:id/toggle-status', CategoryController.toggleStatus as RequestHandler);

export default router;
