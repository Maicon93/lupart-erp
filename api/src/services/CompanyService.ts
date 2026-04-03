import { AppDataSource } from '../config/database';
import CompanyRepository from '../repositories/CompanyRepository';
import { Company, CompanyStatus } from '../models/Company';
import { CompanyProfile } from '../models/CompanyProfile';
import { User } from '../models/User';
import messageCodes from '../i18n/MessageCodes';
import seedCompanyData from '../helpers/SeedCompanyData';
import { IAddressFields } from '../interfaces/IAddressFields';

interface ICompanyInput extends IAddressFields {
    name: string;
    cnpj: string;
    phone?: string;
    email?: string;
    accessPlanId: number;
    responsibleId: number;
    matriz?: number | null;
}

interface InspectResult {
    id: number;
    name: string;
    logoUrl: string | null;
}

export default class CompanyService {
    private companyRepository = new CompanyRepository();

    async findAll(search?: string, status?: string, page = 1, limit = 20): Promise<{ data: Company[]; total: number }> {
        return this.companyRepository.findAll(search, status, page, limit);
    }

    async findById(id: number): Promise<Company> {
        const company = await this.companyRepository.findById(id);

        if (!company) {
            throw { status: 404, messageCode: messageCodes.common.messages.NOT_FOUND };
        }

        return company;
    }

    async findByIdWithProfile(id: number): Promise<Company & { profile: CompanyProfile | null }> {
        const { company, profile } = await this.companyRepository.findByIdWithProfile(id);

        if (!company) {
            throw { status: 404, messageCode: messageCodes.common.messages.NOT_FOUND };
        }

        return { ...company, profile };
    }

    async create(input: ICompanyInput): Promise<Company> {
        const existingCompany = await this.companyRepository.findByCnpj(input.cnpj);

        if (existingCompany) {
            throw { status: 400, messageCode: messageCodes.companies.errors.CNPJ_ALREADY_EXISTS };
        }

        return AppDataSource.transaction(async (manager) => {
            const entity = manager.create(Company, {
                name: input.name,
                cnpj: input.cnpj,
                accessPlanId: input.accessPlanId,
                responsibleId: input.responsibleId,
                matriz: input.matriz ?? undefined,
                status: CompanyStatus.ACTIVE,
            });

            const company = await manager.save(entity);

            const profile = manager.create(CompanyProfile, {
                companyId: company.id,
                phone: input.phone ?? undefined,
                email: input.email ?? undefined,
                zipCode: input.zipCode ?? undefined,
                street: input.street,
                number: input.number,
                complement: input.complement,
                neighborhood: input.neighborhood,
                city: input.city ?? undefined,
                state: input.state ?? undefined,
            });

            await manager.save(profile);

            await seedCompanyData(manager, company.id);

            return company;
        });
    }

    async update(id: number, input: ICompanyInput): Promise<Company> {
        const company = await this.findById(id);

        const existingCompany = await this.companyRepository.findByCnpj(input.cnpj);

        if (existingCompany && existingCompany.id !== id) {
            throw { status: 400, messageCode: messageCodes.companies.errors.CNPJ_ALREADY_EXISTS };
        }

        return AppDataSource.transaction(async (manager) => {
            await manager.update(Company, company.id, {
                name: input.name,
                cnpj: input.cnpj,
                accessPlanId: input.accessPlanId,
                responsibleId: input.responsibleId,
                matriz: input.matriz ?? undefined,
            });

            const existingProfile = await manager.findOne(CompanyProfile, { where: { companyId: company.id } });

            if (existingProfile) {
                await manager.update(CompanyProfile, existingProfile.id, {
                    phone: input.phone ?? undefined,
                    email: input.email ?? undefined,
                    zipCode: input.zipCode ?? undefined,
                    street: input.street,
                    number: input.number,
                    complement: input.complement,
                    neighborhood: input.neighborhood,
                    city: input.city ?? undefined,
                    state: input.state ?? undefined,
                });
            } else {
                const profile = manager.create(CompanyProfile, {
                    companyId: company.id,
                    phone: input.phone ?? undefined,
                    email: input.email ?? undefined,
                    zipCode: input.zipCode ?? undefined,
                    street: input.street,
                    number: input.number,
                    complement: input.complement,
                    neighborhood: input.neighborhood,
                    city: input.city ?? undefined,
                    state: input.state ?? undefined,
                });

                await manager.save(profile);
            }

            return manager.findOneByOrFail(Company, { id: company.id });
        });
    }

    async toggleStatus(id: number): Promise<Company> {
        const company = await this.findById(id);
        const newStatus = company.status === CompanyStatus.ACTIVE ? CompanyStatus.INACTIVE : CompanyStatus.ACTIVE;

        if (newStatus === CompanyStatus.INACTIVE) {
            const branchCount = await this.companyRepository.countBranches(id);

            if (branchCount > 0) {
                throw { status: 400, messageCode: messageCodes.companies.errors.HAS_ACTIVE_BRANCHES };
            }
        }

        return AppDataSource.transaction(async (manager) => {
            await manager.update(Company, company.id, { status: newStatus });
            return manager.findOneByOrFail(Company, { id: company.id });
        });
    }

    async findAllActive(): Promise<Company[]> {
        return this.companyRepository.findAllActive();
    }

    async findBranches(id: number): Promise<Company[]> {
        await this.findById(id);
        return this.companyRepository.findBranches(id);
    }

    async inspect(companyId: number, userId: number, userRole: string): Promise<InspectResult> {
        if (userRole !== 'admin') {
            throw { status: 403, messageCode: messageCodes.common.messages.FORBIDDEN };
        }

        const company = await this.findById(companyId);

        if (company.status === CompanyStatus.INACTIVE) {
            throw { status: 400, messageCode: messageCodes.common.messages.NOT_FOUND };
        }

        await AppDataSource.transaction(async (manager) => {
            await manager.update(User, userId, { companyId: company.id });
        });

        return {
            id: company.id,
            name: company.name,
            logoUrl: company.logoUrl ?? null,
        };
    }

    async leaveInspection(userId: number): Promise<void> {
        await AppDataSource.transaction(async (manager) => {
            await manager
                .createQueryBuilder()
                .update(User)
                .set({ companyId: () => 'NULL' })
                .where('id = :id', { id: userId })
                .execute();
        });
    }
}

