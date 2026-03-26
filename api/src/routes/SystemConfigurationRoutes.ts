import { Router } from 'express';
import SystemConfigurationController from '../controllers/SystemConfigurationController';
import { validate } from '../middlewares/validationMiddleware';
import { updateTokensSchema, updateUploadSchema } from '../schemas/SystemConfigurationSchema';

const router = Router();

router.get('/', SystemConfigurationController.findAll);
router.put('/tokens', validate(updateTokensSchema), SystemConfigurationController.updateSection);
router.put('/upload', validate(updateUploadSchema), SystemConfigurationController.updateSection);

export default router;
