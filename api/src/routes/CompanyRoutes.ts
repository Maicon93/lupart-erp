import { Router } from 'express';
import CompanyController from '../controllers/CompanyController';
import { validate } from '../middlewares/validationMiddleware';
import { createCompanySchema, updateCompanySchema } from '../schemas/CompanySchema';

const router = Router();
const controller = new CompanyController();

router.get('/', (req, res) => controller.findAll(req, res));
router.get('/active', (req, res) => controller.findAllActive(req, res));
router.post('/leave-inspection', (req, res) => controller.leaveInspection(req as any, res));
router.get('/:id', (req, res) => controller.findById(req, res));
router.get('/:id/branches', (req, res) => controller.findBranches(req, res));
router.post('/', validate(createCompanySchema), (req, res) => controller.create(req, res));
router.post('/:id/inspect', (req, res) => controller.inspect(req as any, res));
router.put('/:id', validate(updateCompanySchema), (req, res) => controller.update(req, res));
router.patch('/:id/toggle-status', (req, res) => controller.toggleStatus(req, res));

export default router;
