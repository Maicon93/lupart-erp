import { Router, RequestHandler } from 'express';
import MeasurementUnitController from '../controllers/MeasurementUnitController';
import { validate } from '../middlewares/validationMiddleware';
import { createMeasurementUnitSchema, updateMeasurementUnitSchema } from '../schemas/MeasurementUnitSchema';

const router = Router();

router.get('/', MeasurementUnitController.findAll as RequestHandler);
router.get('/:id', MeasurementUnitController.findById as RequestHandler);
router.post('/', validate(createMeasurementUnitSchema), MeasurementUnitController.create as RequestHandler);
router.put('/:id', validate(updateMeasurementUnitSchema), MeasurementUnitController.update as RequestHandler);
router.patch('/:id/toggle-status', MeasurementUnitController.toggleStatus as RequestHandler);

export default router;
