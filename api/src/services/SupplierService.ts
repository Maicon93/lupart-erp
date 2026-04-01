import { AppDataSource } from '../config/database';
import { Supplier } from '../models/Supplier';
import SupplierRepository from '../repositories/SupplierRepository';
import messageCodes from '../i18n/MessageCodes';

interface ISupplierInput {
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
    return SupplierRepository.findAll(companyId, search, page, limit);
};

const findById = async (id: number, companyId: number) => {
    const supplier = await SupplierRepository.findById(id, companyId);

    if (!supplier) {
        throw { status: 404, messageCode: messageCodes.common.messages.NOT_FOUND };
    }

    return supplier;
};

const create = async (companyId: number, input: ISupplierInput) => {
    const existing = await SupplierRepository.findByCpfCnpj(input.cpfCnpj, companyId);

    if (existing) {
        throw { status: 400, messageCode: messageCodes.suppliers.errors.CPF_CNPJ_ALREADY_EXISTS };
    }

    const result = await AppDataSource.transaction(async (manager) => {
        const supplier = manager.create(Supplier, {
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

        return manager.save(supplier);
    });

    return result;
};

const update = async (id: number, companyId: number, input: ISupplierInput) => {
    const supplier = await SupplierRepository.findById(id, companyId);

    if (!supplier) {
        throw { status: 404, messageCode: messageCodes.common.messages.NOT_FOUND };
    }

    const existing = await SupplierRepository.findByCpfCnpj(input.cpfCnpj, companyId);

    if (existing && existing.id !== id) {
        throw { status: 400, messageCode: messageCodes.suppliers.errors.CPF_CNPJ_ALREADY_EXISTS };
    }

    await AppDataSource.transaction(async (manager) => {
        supplier.name = input.name;
        supplier.cpfCnpj = input.cpfCnpj;
        supplier.phone = input.phone;
        supplier.email = input.email || null as unknown as string;
        supplier.zipCode = input.zipCode || null as unknown as string;
        supplier.street = input.street || null as unknown as string;
        supplier.number = input.number || null as unknown as string;
        supplier.complement = input.complement || null as unknown as string;
        supplier.neighborhood = input.neighborhood || null as unknown as string;
        supplier.city = input.city || null as unknown as string;
        supplier.state = input.state || null as unknown as string;
        supplier.notes = input.notes || null as unknown as string;
        await manager.save(supplier);
    });

    return supplier;
};

const remove = async (id: number, companyId: number) => {
    const supplier = await SupplierRepository.findById(id, companyId);

    if (!supplier) {
        throw { status: 404, messageCode: messageCodes.common.messages.NOT_FOUND };
    }

    // TODO: verificar vínculos ativos (stock_entries, financial_titles)

    await AppDataSource.transaction(async (manager) => {
        await manager.softRemove(supplier);
    });
};

export default { findAll, findById, create, update, remove };
