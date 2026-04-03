import { Router } from 'express';
import UserController from '../controllers/UserController';
import { validate } from '../middlewares/validationMiddleware';
import { createUserSchema, updateUserSchema } from '../schemas/UserSchema';

const router = Router();
const controller = new UserController();

router.get('/', (req, res) => controller.findAll(req, res));
router.get('/active', (req, res) => controller.findAllActive(req, res));
router.get('/roles', (req, res) => controller.findGlobalRoles(req, res));
router.get('/:id', (req, res) => controller.findById(req, res));
router.post('/', validate(createUserSchema), (req, res) => controller.create(req, res));
router.put('/:id', validate(updateUserSchema), (req, res) => controller.update(req, res));
router.patch('/:id/toggle-status', (req, res) => controller.toggleStatus(req, res));

export default router;
