import { Router } from 'express';
import logger from '../helpers/Logger';

const router = Router();

router.get('/health', (_request, response) => {
    logger.info('Health check requested');
    response.json({ type: 'success', data: { status: 'ok' } });
});

export default router;
