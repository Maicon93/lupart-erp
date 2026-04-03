import { AppDataSource } from '../config/database';
import { Product } from '../models/Product';

export default class ProductRepository {
    private repository = AppDataSource.getRepository(Product);

    async findAll(
        companyId: number,
        search?: string,
        type?: string,
        categoryId?: number,
        status?: string,
        page = 1,
        limit = 20
    ): Promise<{ data: Product[]; total: number }> {
        const query = this.repository
            .createQueryBuilder('product')
            .leftJoinAndSelect('product.category', 'category')
            .leftJoinAndSelect('product.measurementUnit', 'measurementUnit')
            .where('product.companyId = :companyId', { companyId });

        if (search) {
            query.andWhere(
                '(product.name ILIKE :search OR product.code ILIKE :search OR product.barcode ILIKE :search)',
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
    }

    async findById(id: number, companyId: number): Promise<Product | null> {
        return this.repository.findOne({
            where: { id, companyId },
            relations: ['category', 'measurementUnit'],
        });
    }

    async findByCode(code: string, companyId: number): Promise<Product | null> {
        return this.repository.findOne({ where: { code, companyId } });
    }
}

