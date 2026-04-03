import { Router } from 'express';
import PermissionController from '../controllers/PermissionController';

const router = Router();
const controller = new PermissionController();

router.get('/check', (req, res) => controller.checkPermission(req as any, res));
router.get('/', (req, res) => controller.findAll(req as any, res));

export default router;
