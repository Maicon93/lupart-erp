import { AppDataSource } from '../config/database';
import { Category } from '../models/Category';

const repository = AppDataSource.getRepository(Category);

const findAll = async (
    companyId: number,
    search?: string,
    status?: string,
    page = 1,
    limit = 20
): Promise<{ data: Category[]; total: number }> => {
    const query = repository
        .createQueryBuilder('category')
        .where('category.companyId = :companyId', { companyId });

    if (search) {
        query.andWhere('(category.name ILIKE :search)', { search: `%${search}%` });
    }

    if (status && status !== 'all') {
        query.andWhere('category.status = :status', { status });
    }

    query.orderBy('category.id', 'ASC');
    query.skip((page - 1) * limit).take(limit);

    const [data, total] = await query.getManyAndCount();
    return { data, total };
};

const findById = async (id: number, companyId: number): Promise<Category | null> => {
    return repository.findOne({ where: { id, companyId } });
};

const findByName = async (name: string, companyId: number): Promise<Category | null> => {
    return repository.findOne({ where: { name, companyId } });
};

export default { findAll, findById, findByName };
