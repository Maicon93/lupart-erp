import { AppDataSource } from '../config/database';
import { Company } from '../models/Company';
import { CompanyProfile } from '../models/CompanyProfile';

export default class CompanyRepository {
    private repository = AppDataSource.getRepository(Company);
    private profileRepository = AppDataSource.getRepository(CompanyProfile);

    async findAll(search?: string, status?: string, page = 1, limit = 20): Promise<{ data: Company[]; total: number }> {
        const query = this.repository
            .createQueryBuilder('company')
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
    }

    async findById(id: number): Promise<Company | null> {
        return this.repository.findOne({
            where: { id },
            relations: ['accessPlan', 'responsible', 'matrizCompany'],
        });
    }

    async findByIdWithProfile(id: number): Promise<{ company: Company | null; profile: CompanyProfile | null }> {
        const company = await this.repository.findOne({
            where: { id },
            relations: ['accessPlan', 'responsible', 'matrizCompany'],
        });

        const profile = company ? await this.profileRepository.findOne({ where: { companyId: id } }) : null;

        return { company, profile };
    }

    async findByCnpj(cnpj: string): Promise<Company | null> {
        return this.repository.findOne({ where: { cnpj } });
    }

    async countBranches(matrizId: number): Promise<number> {
        return this.repository.count({ where: { matriz: matrizId } });
    }

    async findAllActive(): Promise<Company[]> {
        return this.repository.find({
            where: { status: 'active' as Company['status'] },
            select: ['id', 'name'],
        });
    }

    async findBranches(matrizId: number): Promise<Company[]> {
        return this.repository.find({
            where: { matriz: matrizId },
            select: ['id', 'name', 'cnpj', 'status'],
        });
    }
}

