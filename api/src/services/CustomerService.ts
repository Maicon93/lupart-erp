import { AppDataSource } from '../config/database';
import { Customer } from '../models/Customer';
import CustomerRepository from '../repositories/CustomerRepository';
import messageCodes from '../i18n/MessageCodes';

interface ICustomerInput {
    name: string;
    cpfCnpj: string;
    phone: string;
    email?: string;
    zipCode?: string;
    street?: string;
    number?: string;
    complement?: string;
    neighborhood?: string;
    city?: string;
    state?: string;
    notes?: string;
}

const findAll = async (companyId: number, search?: string, page = 1, limit = 20) => {
    return CustomerRepository.findAll(companyId, search, page, limit);
};

const findById = async (id: number, companyId: number) => {
    const customer = await CustomerRepository.findById(id, companyId);

    if (!customer) {
        throw { status: 404, messageCode: messageCodes.common.messages.NOT_FOUND };
    }

    return customer;
};

const create = async (companyId: number, input: ICustomerInput) => {
    const existing = await CustomerRepository.findByCpfCnpj(input.cpfCnpj, companyId);

    if (existing) {
        throw { status: 400, messageCode: messageCodes.customers.errors.CPF_CNPJ_ALREADY_EXISTS };
    }

    const result = await AppDataSource.transaction(async (manager) => {
        const customer = manager.create(Customer, {
            companyId,
            name: input.name,
            cpfCnpj: input.cpfCnpj,
            phone: input.phone,
            email: input.email || undefined,
            zipCode: input.zipCode || undefined,
            street: input.street || undefined,
            number: input.number || undefined,
            complement: input.complement || undefined,
            neighborhood: input.neighborhood || undefined,
            city: input.city || undefined,
            state: input.state || undefined,
            notes: input.notes || undefined,
        });

        return manager.save(customer);
    });

    return result;
};

const update = async (id: number, companyId: number, input: ICustomerInput) => {
    const customer = await CustomerRepository.findById(id, companyId);

    if (!customer) {
        throw { status: 404, messageCode: messageCodes.common.messages.NOT_FOUND };
    }

    const existing = await CustomerRepository.findByCpfCnpj(input.cpfCnpj, companyId);

    if (existing && existing.id !== id) {
        throw { status: 400, messageCode: messageCodes.customers.errors.CPF_CNPJ_ALREADY_EXISTS };
    }

    await AppDataSource.transaction(async (manager) => {
        customer.name = input.name;
        customer.cpfCnpj = input.cpfCnpj;
        customer.phone = input.phone;
        customer.email = input.email || null as unknown as string;
        customer.zipCode = input.zipCode || null as unknown as string;
        customer.street = input.street || null as unknown as string;
        customer.number = input.number || null as unknown as string;
        customer.complement = input.complement || null as unknown as string;
        customer.neighborhood = input.neighborhood || null as unknown as string;
        customer.city = input.city || null as unknown as string;
        customer.state = input.state || null as unknown as string;
        customer.notes = input.notes || null as unknown as string;
        await manager.save(customer);
    });

    return customer;
};

const remove = async (id: number, companyId: number) => {
    const customer = await CustomerRepository.findById(id, companyId);

    if (!customer) {
        throw { status: 404, messageCode: messageCodes.common.messages.NOT_FOUND };
    }

    // TODO: verificar vínculos ativos (sales, quotes, service_orders, financial_titles)

    await AppDataSource.transaction(async (manager) => {
        await manager.softRemove(customer);
    });
};

export default { findAll, findById, create, update, remove };
