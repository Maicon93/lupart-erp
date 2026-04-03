import { AppDataSource } from '../config/database';
import { SystemConfiguration } from '../models/SystemConfiguration';

export default class SystemConfigurationRepository {
    private repository = AppDataSource.getRepository(SystemConfiguration);

    async findAll(): Promise<SystemConfiguration[]> {
        return this.repository.find({ order: { id: 'ASC' } });
    }

    async findByKey(key: string): Promise<SystemConfiguration | null> {
        return this.repository.findOne({ where: { key } });
    }

    async updateByKey(key: string, value: string): Promise<void> {
        await this.repository.update({ key }, { value });
    }
}

