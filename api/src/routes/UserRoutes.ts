import { Router } from 'express';
import UserController from '../controllers/UserController';
import ValidationMiddleware from '../middlewares/validationMiddleware';
import { createUserSchema, updateUserSchema } from '../schemas/UserSchema';

const router = Router();

router.get('/', UserController.findAll);
router.get('/active', UserController.findAllActive);
router.get('/roles', UserController.findGlobalRoles);
router.get('/:id', UserController.findById);
router.post('/', ValidationMiddleware.validate(createUserSchema), UserController.create);
router.put('/:id', ValidationMiddleware.validate(updateUserSchema), UserController.update);
router.patch('/:id/toggle-status', UserController.toggleStatus);

export default router;
