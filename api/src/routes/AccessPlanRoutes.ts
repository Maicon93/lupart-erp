import { Router } from 'express';
import AccessPlanController from '../controllers/AccessPlanController';
import ValidationMiddleware from '../middlewares/validationMiddleware';
import { createAccessPlanSchema, updateAccessPlanSchema } from '../schemas/AccessPlanSchema';

const router = Router();

router.get('/', AccessPlanController.findAll);
router.get('/:id', AccessPlanController.findById);
router.post('/', ValidationMiddleware.validate(createAccessPlanSchema), AccessPlanController.create);
router.put('/:id', ValidationMiddleware.validate(updateAccessPlanSchema), AccessPlanController.update);
router.patch('/:id/toggle-status', AccessPlanController.toggleStatus);
router.delete('/:id', AccessPlanController.remove);

export default router;
