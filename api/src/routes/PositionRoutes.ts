import { Router } from 'express';
import PositionController from '../controllers/PositionController';
import { validate } from '../middlewares/validationMiddleware';
import { createPositionSchema, updatePositionSchema } from '../schemas/PositionSchema';

const router = Router();
const controller = new PositionController();

router.get('/', (req, res) => controller.findAll(req, res));
router.get('/:id', (req, res) => controller.findById(req, res));
router.post('/', validate(createPositionSchema), (req, res) => controller.create(req, res));
router.put('/:id', validate(updatePositionSchema), (req, res) => controller.update(req, res));
router.delete('/:id', (req, res) => controller.remove(req, res));

export default router;
