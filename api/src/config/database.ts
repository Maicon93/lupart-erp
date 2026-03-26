import { DataSource } from 'typeorm';
import environment from './environment';

export const AppDataSource = new DataSource({
    type: 'postgres',
    host: environment.DB_HOST,
    port: parseInt(environment.DB_PORT),
    username: environment.DB_USERNAME,
    password: environment.DB_PASSWORD,
    database: environment.DB_DATABASE,
    synchronize: false,
    logging: false,
    entities: ['src/models/**/*.ts'],
    migrations: ['src/migrations/**/*.ts'],
});
