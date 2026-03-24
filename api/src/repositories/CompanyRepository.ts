import { AppDataSource } from '../config/database';
import { Company } from '../models/Company';
import { CompanyProfile } from '../models/CompanyProfile';

const repository = AppDataSource.getRepository(Company);
const profileRepository = AppDataSource.getRepository(CompanyProfile);

const findAll = async (search?: string, status?: string, page = 1, limit = 20): Promise<{ data: Company[]; total: number }> => {
    const query = repository.createQueryBuilder('company')
        .leftJoinAndSelect('company.accessPlan', 'accessPlan')
        .leftJoinAndSelect('company.responsible', 'responsible');

    if (search) {
        query.where('(company.name ILIKE :search OR company.cnpj ILIKE :search)', { search: `%${search}%` });
    }

    if (status && status !== 'all') {
        query.andWhere('company.status = :status', { status });
    }

    query.orderBy('company.id', 'ASC');
    query.skip((page - 1) * limit).take(limit);

    const [data, total] = await query.getManyAndCount();
    return { data, total };
};

const findById = async (id: number): Promise<Company | null> => {
    return repository.findOne({
        where: { id },
        relations: ['accessPlan', 'responsible', 'matrizCompany'],
    });
};

const findByIdWithProfile = async (id: number): Promise<{ company: Company | null; profile: CompanyProfile | null }> => {
    const company = await repository.findOne({
        where: { id },
        relations: ['accessPlan', 'responsible', 'matrizCompany'],
    });

    const profile = company
        ? await profileRepository.findOne({ where: { companyId: id } })
        : null;

    return { company, profile };
};

const findByCnpj = async (cnpj: string): Promise<Company | null> => {
    return repository.findOne({ where: { cnpj } });
};

const countBranches = async (matrizId: number): Promise<number> => {
    return repository.count({ where: { matriz: matrizId } });
};

const findAllActive = async (): Promise<Company[]> => {
    return repository.find({
        where: { status: 'active' as Company['status'] },
        select: ['id', 'name'],
    });
};

const findBranches = async (matrizId: number): Promise<Company[]> => {
    return repository.find({
        where: { matriz: matrizId },
        select: ['id', 'name', 'cnpj', 'status'],
    });
};

export default { findAll, findById, findByIdWithProfile, findByCnpj, countBranches, findAllActive, findBranches };
