import { Router } from 'express';
import SystemConfigurationController from '../controllers/SystemConfigurationController';
import ValidationMiddleware from '../middlewares/validationMiddleware';
import { updateTokensSchema, updateUploadSchema } from '../schemas/SystemConfigurationSchema';

const router = Router();

router.get('/', SystemConfigurationController.findAll);
router.put('/tokens', ValidationMiddleware.validate(updateTokensSchema), SystemConfigurationController.updateSection);
router.put('/upload', ValidationMiddleware.validate(updateUploadSchema), SystemConfigurationController.updateSection);

export default router;
