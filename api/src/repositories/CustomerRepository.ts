import { AppDataSource } from '../config/database';
import { Customer } from '../models/Customer';
import { IsNull } from 'typeorm';

const repository = AppDataSource.getRepository(Customer);

const findAll = async (
    companyId: number,
    search?: string,
    page = 1,
    limit = 20
): Promise<{ data: Customer[]; total: number }> => {
    const query = repository
        .createQueryBuilder('customer')
        .where('customer.companyId = :companyId', { companyId })
        .andWhere('customer.deletedAt IS NULL');

    if (search) {
        query.andWhere(
            '(customer.name ILIKE :search OR customer.cpfCnpj ILIKE :search)',
            { search: `%${search}%` }
        );
    }

    query.orderBy('customer.name', 'ASC');
    query.skip((page - 1) * limit).take(limit);

    const [data, total] = await query.getManyAndCount();
    return { data, total };
};

const findById = async (id: number, companyId: number): Promise<Customer | null> => {
    return repository.findOne({ where: { id, companyId, deletedAt: IsNull() } });
};

const findByCpfCnpj = async (cpfCnpj: string, companyId: number): Promise<Customer | null> => {
    return repository.findOne({ where: { cpfCnpj, companyId, deletedAt: IsNull() } });
};

export default { findAll, findById, findByCpfCnpj };
