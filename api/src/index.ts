import 'reflect-metadata';
import 'dotenv/config';
import environment from './config/environment';
import app from './app';
import { AppDataSource } from './config/database';
import logger from './helpers/Logger';

AppDataSource.initialize()
    .then(() => {
        logger.info('Database connection established');

        app.listen(environment.PORT, () => {
            logger.info(`Server running on port ${environment.PORT}`);
        });
    })
    .catch((error) => {
        logger.error('Database connection failed', { error: error.message });
        process.exit(1);
    });
