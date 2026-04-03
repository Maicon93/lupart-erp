import { Router } from 'express';
import { rateLimit } from 'express-rate-limit';
import AuthController from '../controllers/AuthController';
import { validate } from '../middlewares/validationMiddleware';
import { loginSchema } from '../schemas/AuthSchema';
import messageCodes from '../i18n/MessageCodes';

const router = Router();
const controller = new AuthController();

const authLimiter = rateLimit({
    windowMs: 1000,
    limit: 2,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    message: { type: 'error', messageCode: messageCodes.common.messages.TOO_MANY_REQUESTS },
});

router.post('/login', authLimiter, validate(loginSchema), (req, res) => controller.login(req as any, res));
router.post('/refresh-token', authLimiter, (req, res) => controller.refresh(req as any, res));
router.post('/logout', (req, res) => controller.logout(req as any, res));
router.patch('/preferences', (req, res) => controller.updatePreferences(req as any, res));

export default router;
