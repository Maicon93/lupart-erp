import { Router } from 'express';
import MeasurementUnitController from '../controllers/MeasurementUnitController';
import { validate } from '../middlewares/validationMiddleware';
import { createMeasurementUnitSchema, updateMeasurementUnitSchema } from '../schemas/MeasurementUnitSchema';

const router = Router();
const controller = new MeasurementUnitController();

router.get('/', (req, res) => controller.findAll(req as any, res));
router.get('/:id', (req, res) => controller.findById(req as any, res));
router.post('/', validate(createMeasurementUnitSchema), (req, res) => controller.create(req as any, res));
router.put('/:id', validate(updateMeasurementUnitSchema), (req, res) => controller.update(req as any, res));
router.patch('/:id/toggle-status', (req, res) => controller.toggleStatus(req as any, res));

export default router;
