import { AppDataSource } from '../config/database';
import { Category } from '../models/Category';

export default class CategoryRepository {
    private repository = AppDataSource.getRepository(Category);

    async findAll(
        companyId: number,
        search?: string,
        status?: string,
        page = 1,
        limit = 20
    ): Promise<{ data: Category[]; total: number }> {
        const query = this.repository
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
    }

    async findById(id: number, companyId: number): Promise<Category | null> {
        return this.repository.findOne({ where: { id, companyId } });
    }

    async findByName(name: string, companyId: number): Promise<Category | null> {
        return this.repository.findOne({ where: { name, companyId } });
    }
}

