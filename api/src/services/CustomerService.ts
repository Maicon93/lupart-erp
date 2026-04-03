import { AppDataSource } from '../config/database';
import { Customer } from '../models/Customer';
import CustomerRepository from '../repositories/CustomerRepository';
import messageCodes from '../i18n/MessageCodes';
import { IPersonInput } from '../interfaces/IPersonInput';

export default class CustomerService {
    private customerRepository = new CustomerRepository();

    async findAll(companyId: number, search?: string, page = 1, limit = 20) {
        return this.customerRepository.findAll(companyId, search, page, limit);
    }

    async findById(id: number, companyId: number) {
        const customer = await this.customerRepository.findById(id, companyId);

        if (!customer) {
            throw { status: 404, messageCode: messageCodes.common.messages.NOT_FOUND };
        }

        return customer;
    }

    async create(companyId: number, input: IPersonInput) {
        const existing = await this.customerRepository.findByCpfCnpj(input.cpfCnpj, companyId);

        if (existing) {
            throw { status: 400, messageCode: messageCodes.customers.errors.CPF_CNPJ_ALREADY_EXISTS };
        }

        const result = await AppDataSource.transaction(async (manager) => {
            const customer = manager.create(Customer, {
                companyId,
                name: input.name,
                cpfCnpj: input.cpfCnpj,
                phone: input.phone,
                email: input.email ?? undefined,
                zipCode: input.zipCode ?? undefined,
                street: input.street ?? undefined,
                number: input.number ?? undefined,
                complement: input.complement ?? undefined,
                neighborhood: input.neighborhood ?? undefined,
                city: input.city ?? undefined,
                state: input.state ?? undefined,
                notes: input.notes ?? undefined,
            });

            return manager.save(customer);
        });

        return result;
    }

    async update(id: number, companyId: number, input: IPersonInput) {
        const customer = await this.customerRepository.findById(id, companyId);

        if (!customer) {
            throw { status: 404, messageCode: messageCodes.common.messages.NOT_FOUND };
        }

        const existing = await this.customerRepository.findByCpfCnpj(input.cpfCnpj, companyId);

        if (existing && existing.id !== id) {
            throw { status: 400, messageCode: messageCodes.customers.errors.CPF_CNPJ_ALREADY_EXISTS };
        }

        await AppDataSource.transaction(async (manager) => {
            customer.name = input.name;
            customer.cpfCnpj = input.cpfCnpj;
            customer.phone = input.phone;
            customer.email = input.email ?? null as unknown as string;
            customer.zipCode = input.zipCode ?? null as unknown as string;
            customer.street = input.street ?? null as unknown as string;
            customer.number = input.number ?? null as unknown as string;
            customer.complement = input.complement ?? null as unknown as string;
            customer.neighborhood = input.neighborhood ?? null as unknown as string;
            customer.city = input.city ?? null as unknown as string;
            customer.state = input.state ?? null as unknown as string;
            customer.notes = input.notes ?? null as unknown as string;
            await manager.save(customer);
        });

        return customer;
    }

    async remove(id: number, companyId: number) {
        const customer = await this.customerRepository.findById(id, companyId);

        if (!customer) {
            throw { status: 404, messageCode: messageCodes.common.messages.NOT_FOUND };
        }

        // TODO: verificar vínculos ativos (sales, quotes, service_orders, financial_titles)

        await AppDataSource.transaction(async (manager) => {
            await manager.softRemove(customer);
        });
    }
}

