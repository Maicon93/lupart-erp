import 'reflect-metadata';
import 'dotenv/config';
import app from './app';
import { AppDataSource } from './config/database';
import logger from './helpers/Logger';

const PORT = process.env.PORT || 8001;

AppDataSource.initialize()
    .then(() => {
        logger.info('Database connection established');

        app.listen(PORT, () => {
            logger.info(`Server running on port ${PORT}`);
        });
    })
    .catch((error) => {
        logger.error('Database connection failed', { error: error.message });
        process.exit(1);
    });
