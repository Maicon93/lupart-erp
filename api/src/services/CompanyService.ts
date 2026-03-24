import { AppDataSource } from '../config/database';
import CompanyRepository from '../repositories/CompanyRepository';
import { Company, CompanyStatus } from '../models/Company';
import { CompanyProfile } from '../models/CompanyProfile';
import messageCodes from '../i18n/MessageCodes';
import seedCompanyData from '../helpers/SeedCompanyData';

interface ICompanyInput {
    name: string;
    cnpj: string;
    phone?: string;
    email?: string;
    zipCode?: string;
    street: string;
    number: string;
    complement: string;
    neighborhood: string;
    city?: string;
    state?: string;
    accessPlanId: number;
    responsibleId: number;
    matriz?: number | null;
}

const findAll = async (search?: string, status?: string, page = 1, limit = 20): Promise<{ data: Company[]; total: number }> => {
    return CompanyRepository.findAll(search, status, page, limit);
};

const findById = async (id: number): Promise<Company> => {
    const company = await CompanyRepository.findById(id);

    if (!company) {
        throw { status: 404, messageCode: messageCodes.common.messages.NOT_FOUND };
    }

    return company;
};

const findByIdWithProfile = async (id: number): Promise<Company & { profile: CompanyProfile | null }> => {
    const { company, profile } = await CompanyRepository.findByIdWithProfile(id);

    if (!company) {
        throw { status: 404, messageCode: messageCodes.common.messages.NOT_FOUND };
    }

    return { ...company, profile };
};

const create = async (input: ICompanyInput): Promise<Company> => {
    const existingCompany = await CompanyRepository.findByCnpj(input.cnpj);

    if (existingCompany) {
        throw { status: 400, messageCode: messageCodes.companies.errors.CNPJ_ALREADY_EXISTS };
    }

    return AppDataSource.transaction(async (manager) => {
        const entity = manager.create(Company, {
            name: input.name,
            cnpj: input.cnpj,
            accessPlanId: input.accessPlanId,
            responsibleId: input.responsibleId,
            matriz: input.matriz || undefined,
            status: CompanyStatus.ACTIVE,
        });

        const company = await manager.save(entity);

        const profile = manager.create(CompanyProfile, {
            companyId: company.id,
            phone: input.phone || undefined,
            email: input.email || undefined,
            zipCode: input.zipCode || undefined,
            street: input.street,
            number: input.number,
            complement: input.complement,
            neighborhood: input.neighborhood,
            city: input.city || undefined,
            state: input.state || undefined,
        });

        await manager.save(profile);

        await seedCompanyData(manager, company.id);

        return company;
    });
};

const update = async (id: number, input: ICompanyInput): Promise<Company> => {
    const company = await findById(id);

    const existingCompany = await CompanyRepository.findByCnpj(input.cnpj);

    if (existingCompany && existingCompany.id !== id) {
        throw { status: 400, messageCode: messageCodes.companies.errors.CNPJ_ALREADY_EXISTS };
    }

    return AppDataSource.transaction(async (manager) => {
        await manager.update(Company, company.id, {
            name: input.name,
            cnpj: input.cnpj,
            accessPlanId: input.accessPlanId,
            responsibleId: input.responsibleId,
            matriz: input.matriz || undefined,
        });

        const existingProfile = await manager.findOne(CompanyProfile, { where: { companyId: company.id } });

        if (existingProfile) {
            await manager.update(CompanyProfile, existingProfile.id, {
                phone: input.phone || undefined,
                email: input.email || undefined,
                zipCode: input.zipCode || undefined,
                street: input.street,
                number: input.number,
                complement: input.complement,
                neighborhood: input.neighborhood,
                city: input.city || undefined,
                state: input.state || undefined,
            });
        } else {
            const profile = manager.create(CompanyProfile, {
                companyId: company.id,
                phone: input.phone || undefined,
                email: input.email || undefined,
                zipCode: input.zipCode || undefined,
                street: input.street,
                number: input.number,
                complement: input.complement,
                neighborhood: input.neighborhood,
                city: input.city || undefined,
                state: input.state || undefined,
            });

            await manager.save(profile);
        }

        return manager.findOneByOrFail(Company, { id: company.id });
    });
};

const toggleStatus = async (id: number): Promise<Company> => {
    const company = await findById(id);
    const newStatus = company.status === CompanyStatus.ACTIVE
        ? CompanyStatus.INACTIVE
        : CompanyStatus.ACTIVE;

    if (newStatus === CompanyStatus.INACTIVE) {
        const branchCount = await CompanyRepository.countBranches(id);

        if (branchCount > 0) {
            throw { status: 400, messageCode: messageCodes.companies.errors.HAS_ACTIVE_BRANCHES };
        }
    }

    return AppDataSource.transaction(async (manager) => {
        await manager.update(Company, company.id, { status: newStatus });
        return manager.findOneByOrFail(Company, { id: company.id });
    });
};

const findAllActive = async (): Promise<Company[]> => {
    return CompanyRepository.findAllActive();
};

const findBranches = async (id: number): Promise<Company[]> => {
    await findById(id);
    return CompanyRepository.findBranches(id);
};

export default { findAll, findById, findByIdWithProfile, create, update, toggleStatus, findAllActive, findBranches };
