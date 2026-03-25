import { Router } from 'express';
import permissionController from '../controllers/PermissionController';

const router = Router();

router.get('/check', permissionController.checkPermission);
router.get('/', permissionController.findAll);

export default router;
