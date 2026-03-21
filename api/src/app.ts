import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { rateLimit } from 'express-rate-limit';
import routes from './routes';

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors());

const generalLimiter = rateLimit({
    windowMs: 60 * 1000,
    limit: 200,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    message: { type: 'error', messageCode: 'common.messages.TOO_MANY_REQUESTS' },
});

app.use(generalLimiter);

app.use('/api', routes);

export default app;
