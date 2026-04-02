import { AppDataSource } from '../config/database';
import { Product } from '../models/Product';

const repository = AppDataSource.getRepository(Product);

const findAll = async (
    companyId: number,
    search?: string,
    type?: string,
    categoryId?: number,
    status?: string,
    page = 1,
    limit = 20
): Promise<{ data: Product[]; total: number }> => {
    const query = repository
        .createQueryBuilder('product')
        .leftJoinAndSelect('product.category', 'category')
        .leftJoinAndSelect('product.measurementUnit', 'measurementUnit')
        .where('product.companyId = :companyId', { companyId });

    if (search) {
        query.andWhere(
            '(product.name ILIKE :search OR product.code ILIKE :search)',
            { search: `%${search}%` }
        );
    }

    if (type && type !== 'all') {
        query.andWhere('product.type = :type', { type });
    }

    if (categoryId) {
        query.andWhere('product.categoryId = :categoryId', { categoryId });
    }

    if (status && status !== 'all') {
        query.andWhere('product.status = :status', { status });
    }

    query.orderBy('product.name', 'ASC');
    query.skip((page - 1) * limit).take(limit);

    const [data, total] = await query.getManyAndCount();
    return { data, total };
};

const findById = async (id: number, companyId: number): Promise<Product | null> => {
    return repository.findOne({
        where: { id, companyId },
        relations: ['category', 'measurementUnit'],
    });
};

const findByCode = async (code: string, companyId: number): Promise<Product | null> => {
    return repository.findOne({ where: { code, companyId } });
};

export default { findAll, findById, findByCode };
