import { Router } from 'express';
import SystemConfigurationController from '../controllers/SystemConfigurationController';
import { validate } from '../middlewares/validationMiddleware';
import { updateTokensSchema, updateUploadSchema } from '../schemas/SystemConfigurationSchema';

const router = Router();
const controller = new SystemConfigurationController();

router.get('/', (req, res) => controller.findAll(req, res));
router.put('/tokens', validate(updateTokensSchema), (req, res) => controller.updateSection(req, res));
router.put('/upload', validate(updateUploadSchema), (req, res) => controller.updateSection(req, res));

export default router;
