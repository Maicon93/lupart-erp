import { Router } from 'express';
import AccessPlanController from '../controllers/AccessPlanController';
import { validate } from '../middlewares/validationMiddleware';
import { createAccessPlanSchema, updateAccessPlanSchema } from '../schemas/AccessPlanSchema';

const router = Router();
const controller = new AccessPlanController();

router.get('/', (req, res) => controller.findAll(req, res));
router.get('/:id', (req, res) => controller.findById(req, res));
router.post('/', validate(createAccessPlanSchema), (req, res) => controller.create(req, res));
router.put('/:id', validate(updateAccessPlanSchema), (req, res) => controller.update(req, res));
router.patch('/:id/toggle-status', (req, res) => controller.toggleStatus(req, res));
router.delete('/:id', (req, res) => controller.remove(req, res));

export default router;
