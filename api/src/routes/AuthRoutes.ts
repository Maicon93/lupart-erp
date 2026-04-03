import { Router } from 'express';
import { rateLimit } from 'express-rate-limit';
import AuthController from '../controllers/AuthController';
import { validate } from '../middlewares/validationMiddleware';
import { loginSchema } from '../schemas/AuthSchema';
import messageCodes from '../i18n/MessageCodes';

const router = Router();

const authLimiter = rateLimit({
    windowMs: 1000,
    limit: 2,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    message: { type: 'error', messageCode: messageCodes.common.messages.TOO_MANY_REQUESTS },
});

router.post('/login', authLimiter, validate(loginSchema), AuthController.login);
router.post('/refresh-token', authLimiter, AuthController.refresh);
router.post('/logout', AuthController.logout);
router.patch('/preferences', AuthController.updatePreferences);

export default router;
