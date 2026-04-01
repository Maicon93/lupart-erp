import { AppDataSource } from '../config/database';
import { Supplier } from '../models/Supplier';
import { IsNull } from 'typeorm';

const repository = AppDataSource.getRepository(Supplier);

const findAll = async (
    companyId: number,
    search?: string,
    page = 1,
    limit = 20
): Promise<{ data: Supplier[]; total: number }> => {
    const query = repository
        .createQueryBuilder('supplier')
        .where('supplier.companyId = :companyId', { companyId })
        .andWhere('supplier.deletedAt IS NULL');

    if (search) {
        query.andWhere(
            '(supplier.name ILIKE :search OR supplier.cpfCnpj ILIKE :search)',
            { search: `%${search}%` }
        );
    }

    query.orderBy('supplier.name', 'ASC');
    query.skip((page - 1) * limit).take(limit);

    const [data, total] = await query.getManyAndCount();
    return { data, total };
};

const findById = async (id: number, companyId: number): Promise<Supplier | null> => {
    return repository.findOne({ where: { id, companyId, deletedAt: IsNull() } });
};

const findByCpfCnpj = async (cpfCnpj: string, companyId: number): Promise<Supplier | null> => {
    return repository.findOne({ where: { cpfCnpj, companyId, deletedAt: IsNull() } });
};

export default { findAll, findById, findByCpfCnpj };
