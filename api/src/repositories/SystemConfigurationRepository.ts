import { AppDataSource } from '../config/database';
import { SystemConfiguration } from '../models/SystemConfiguration';

const repository = AppDataSource.getRepository(SystemConfiguration);

const findAll = async (): Promise<SystemConfiguration[]> => {
    return repository.find({ order: { id: 'ASC' } });
};

const findByKey = async (key: string): Promise<SystemConfiguration | null> => {
    return repository.findOne({ where: { key } });
};

const updateByKey = async (key: string, value: string): Promise<void> => {
    await repository.update({ key }, { value });
};

export default { findAll, findByKey, updateByKey };
