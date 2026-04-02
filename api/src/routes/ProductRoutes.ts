import { Router, RequestHandler } from 'express';
import ProductController from '../controllers/ProductController';
import { validate } from '../middlewares/validationMiddleware';
import { createProductSchema, updateProductSchema } from '../schemas/ProductSchema';

const router = Router();

router.get('/', ProductController.findAll as RequestHandler);
router.get('/:id', ProductController.findById as RequestHandler);
router.post('/', validate(createProductSchema), ProductController.create as RequestHandler);
router.put('/:id', validate(updateProductSchema), ProductController.update as RequestHandler);
router.patch('/:id/toggle-status', ProductController.toggleStatus as RequestHandler);

export default router;
