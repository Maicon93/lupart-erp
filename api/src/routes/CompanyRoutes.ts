import { Router, RequestHandler } from 'express';
import CompanyController from '../controllers/CompanyController';
import ValidationMiddleware from '../middlewares/validationMiddleware';
import { createCompanySchema, updateCompanySchema } from '../schemas/CompanySchema';

const router = Router();

router.get('/', CompanyController.findAll);
router.get('/active', CompanyController.findAllActive);
router.post('/leave-inspection', CompanyController.leaveInspection as RequestHandler);
router.get('/:id', CompanyController.findById);
router.get('/:id/branches', CompanyController.findBranches);
router.post('/', ValidationMiddleware.validate(createCompanySchema), CompanyController.create);
router.post('/:id/inspect', CompanyController.inspect as RequestHandler);
router.put('/:id', ValidationMiddleware.validate(updateCompanySchema), CompanyController.update);
router.patch('/:id/toggle-status', CompanyController.toggleStatus);

export default router;
