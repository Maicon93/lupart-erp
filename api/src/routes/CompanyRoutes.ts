import { Router } from 'express';
import CompanyController from '../controllers/CompanyController';
import { validate } from '../middlewares/validationMiddleware';
import { createCompanySchema, updateCompanySchema } from '../schemas/CompanySchema';

const router = Router();

router.get('/', CompanyController.findAll);
router.get('/active', CompanyController.findAllActive);
router.get('/:id', CompanyController.findById);
router.get('/:id/branches', CompanyController.findBranches);
router.post('/', validate(createCompanySchema), CompanyController.create);
router.put('/:id', validate(updateCompanySchema), CompanyController.update);
router.patch('/:id/toggle-status', CompanyController.toggleStatus);

export default router;
