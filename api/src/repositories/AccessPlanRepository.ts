import { AppDataSource } from '../config/database';
import { AccessPlan } from '../models/AccessPlan';
import { Company } from '../models/Company';

export default class AccessPlanRepository {
    private repository = AppDataSource.getRepository(AccessPlan);
    private companyRepository = AppDataSource.getRepository(Company);

    async findAll(status?: string, page = 1, limit = 20): Promise<{ data: AccessPlan[]; total: number }> {
        const query = this.repository.createQueryBuilder('accessPlan');

        if (status && status !== 'all') {
            query.where('accessPlan.status = :status', { status });
        }

        query.orderBy('accessPlan.id', 'ASC');
        query.skip((page - 1) * limit).take(limit);

        const [data, total] = await query.getManyAndCount();
        return { data, total };
    }

    async findById(id: number): Promise<AccessPlan | null> {
        return this.repository.findOne({ where: { id } });
    }

    async countLinkedCompanies(accessPlanId: number): Promise<number> {
        return this.companyRepository.count({ where: { accessPlanId } });
    }
}

