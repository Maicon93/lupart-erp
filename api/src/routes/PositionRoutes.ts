import { Router } from 'express';
import PositionController from '../controllers/PositionController';
import { validate } from '../middlewares/validationMiddleware';
import { createPositionSchema, updatePositionSchema } from '../schemas/PositionSchema';

const router = Router();

router.get('/', PositionController.findAll);
router.get('/:id', PositionController.findById);
router.post('/', validate(createPositionSchema), PositionController.create);
router.put('/:id', validate(updatePositionSchema), PositionController.update);
router.delete('/:id', PositionController.remove);

export default router;
