import { z } from 'zod';
import logger from '../helpers/Logger';

const environmentSchema = z.object({
    PORT: z.string().min(1),

    DB_HOST: z.string().min(1),
    DB_PORT: z.string().min(1),
    DB_USERNAME: z.string().min(1),
    DB_PASSWORD: z.string().min(1),
    DB_DATABASE: z.string().min(1),

    JWT_SECRET: z.string().min(1),
    JWT_EXPIRES_IN: z.string().min(1),
    JWT_REFRESH_EXPIRES_IN: z.string().min(1),

    AWS_ACCESS_KEY_ID: z.string().min(1),
    AWS_SECRET_ACCESS_KEY: z.string().min(1),
    AWS_REGION: z.string().min(1),
    AWS_BUCKET: z.string().min(1),
});

type Environment = z.infer<typeof environmentSchema>;

const validateEnvironment = (): Environment => {
    const result = environmentSchema.safeParse(process.env);

    if (!result.success) {
        const missing = result.error.issues.map((issue) => issue.path.join('.')).join(', ');
        logger.error(`Missing required environment variables: ${missing}`);
        process.exit(1);
    }

    return result.data;
};

const environment = validateEnvironment();

export default environment;
