import { AppDataSource } from '../config/database';
import { SystemConfiguration } from '../models/SystemConfiguration';

export default class SystemConfigurationRepository {
    private static repository = AppDataSource.getRepository(SystemConfiguration);

    static async findAll(): Promise<SystemConfiguration[]> {
        return this.repository.find({ order: { id: 'ASC' } });
    }

    static async findByKey(key: string): Promise<SystemConfiguration | null> {
        return this.repository.findOne({ where: { key } });
    }

    static async updateByKey(key: string, value: string): Promise<void> {
        await this.repository.update({ key }, { value });
    }
}

