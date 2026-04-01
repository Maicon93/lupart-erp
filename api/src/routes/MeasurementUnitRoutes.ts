import { Router } from 'express';
import MeasurementUnitController from '../controllers/MeasurementUnitController';
import { validate } from '../middlewares/validationMiddleware';
import { createMeasurementUnitSchema, updateMeasurementUnitSchema } from '../schemas/MeasurementUnitSchema';

const router = Router();

router.get('/', MeasurementUnitController.findAll);
router.get('/:id', MeasurementUnitController.findById);
router.post('/', validate(createMeasurementUnitSchema), MeasurementUnitController.create);
router.put('/:id', validate(updateMeasurementUnitSchema), MeasurementUnitController.update);
router.patch('/:id/toggle-status', MeasurementUnitController.toggleStatus);

export default router;
