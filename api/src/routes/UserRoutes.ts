import { Router } from 'express';
import UserController from '../controllers/UserController';
import { validate } from '../middlewares/validationMiddleware';
import { createUserSchema, updateUserSchema } from '../schemas/UserSchema';

const router = Router();

router.get('/', UserController.findAll);
router.get('/active', UserController.findAllActive);
router.get('/roles', UserController.findGlobalRoles);
router.get('/:id', UserController.findById);
router.post('/', validate(createUserSchema), UserController.create);
router.put('/:id', validate(updateUserSchema), UserController.update);
router.patch('/:id/toggle-status', UserController.toggleStatus);

export default router;
