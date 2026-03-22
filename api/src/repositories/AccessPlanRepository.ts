import { AppDataSource } from '../config/database';
import { AccessPlan } from '../models/AccessPlan';
import { Company } from '../models/Company';

const repository = AppDataSource.getRepository(AccessPlan);
const companyRepository = AppDataSource.getRepository(Company);

const findAll = async (status?: string, page = 1, limit = 20): Promise<{ data: AccessPlan[]; total: number }> => {
    const query = repository.createQueryBuilder('accessPlan');

    if (status && status !== 'all') {
        query.where('accessPlan.status = :status', { status });
    }

    query.orderBy('accessPlan.id', 'ASC');
    query.skip((page - 1) * limit).take(limit);

    const [data, total] = await query.getManyAndCount();
    return { data, total };
};

const findById = async (id: number): Promise<AccessPlan | null> => {
    return repository.findOne({ where: { id } });
};

const save = async (accessPlan: Partial<AccessPlan>): Promise<AccessPlan> => {
    const entity = repository.create(accessPlan);
    return repository.save(entity);
};

const update = async (id: number, data: Partial<AccessPlan>): Promise<void> => {
    await repository.update(id, data);
};

const countLinkedCompanies = async (accessPlanId: number): Promise<number> => {
    return companyRepository.count({ where: { accessPlanId } });
};

const remove = async (id: number): Promise<void> => {
    await repository.delete(id);
};

export default { findAll, findById, save, update, countLinkedCompanies, remove };
