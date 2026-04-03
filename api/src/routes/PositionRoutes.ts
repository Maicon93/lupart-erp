import { Router } from 'express';
import PositionController from '../controllers/PositionController';
import ValidationMiddleware from '../middlewares/validationMiddleware';
import { createPositionSchema, updatePositionSchema } from '../schemas/PositionSchema';

const router = Router();

router.get('/', PositionController.findAll);
router.get('/:id', PositionController.findById);
router.post('/', ValidationMiddleware.validate(createPositionSchema), PositionController.create);
router.put('/:id', ValidationMiddleware.validate(updatePositionSchema), PositionController.update);
router.delete('/:id', PositionController.remove);

export default router;
