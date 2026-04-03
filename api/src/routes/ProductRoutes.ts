import { Router, RequestHandler } from 'express';
import ProductController from '../controllers/ProductController';
import ValidationMiddleware from '../middlewares/validationMiddleware';
import { createProductSchema, updateProductSchema } from '../schemas/ProductSchema';

const router = Router();

router.get('/', ProductController.findAll as RequestHandler);
router.get('/:id', ProductController.findById as RequestHandler);
router.post('/', ValidationMiddleware.validate(createProductSchema), ProductController.create as RequestHandler);
router.put('/:id', ValidationMiddleware.validate(updateProductSchema), ProductController.update as RequestHandler);
router.patch('/:id/toggle-status', ProductController.toggleStatus as RequestHandler);

export default router;
