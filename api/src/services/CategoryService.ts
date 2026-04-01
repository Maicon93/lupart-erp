import { AppDataSource } from '../config/database';
import { Category, CategoryStatus } from '../models/Category';
import CategoryRepository from '../repositories/CategoryRepository';
import messageCodes from '../i18n/MessageCodes';

interface ICategoryInput {
    name: string;
    observation?: string;
}

const findAll = async (companyId: number, search?: string, status?: string, page = 1, limit = 20) => {
    return CategoryRepository.findAll(companyId, search, status, page, limit);
};

const findById = async (id: number, companyId: number) => {
    const category = await CategoryRepository.findById(id, companyId);

    if (!category) {
        throw { status: 404, messageCode: messageCodes.common.messages.NOT_FOUND };
    }

    return category;
};

const create = async (companyId: number, input: ICategoryInput) => {
    const existing = await CategoryRepository.findByName(input.name, companyId);

    if (existing) {
        throw { status: 400, messageCode: messageCodes.categories.errors.NAME_ALREADY_EXISTS };
    }

    const result = await AppDataSource.transaction(async (manager) => {
        const category = manager.create(Category, {
            companyId,
            name: input.name,
            observation: input.observation || undefined,
            status: CategoryStatus.ACTIVE,
        });

        return manager.save(category);
    });

    return result;
};

const update = async (id: number, companyId: number, input: ICategoryInput) => {
    const category = await CategoryRepository.findById(id, companyId);

    if (!category) {
        throw { status: 404, messageCode: messageCodes.common.messages.NOT_FOUND };
    }

    const existing = await CategoryRepository.findByName(input.name, companyId);

    if (existing && existing.id !== id) {
        throw { status: 400, messageCode: messageCodes.categories.errors.NAME_ALREADY_EXISTS };
    }

    await AppDataSource.transaction(async (manager) => {
        category.name = input.name;
        category.observation = input.observation || null as unknown as string;
        await manager.save(category);
    });

    return category;
};

const toggleStatus = async (id: number, companyId: number) => {
    const category = await CategoryRepository.findById(id, companyId);

    if (!category) {
        throw { status: 404, messageCode: messageCodes.common.messages.NOT_FOUND };
    }

    await AppDataSource.transaction(async (manager) => {
        category.status =
            category.status === CategoryStatus.ACTIVE
                ? CategoryStatus.INACTIVE
                : CategoryStatus.ACTIVE;
        await manager.save(category);
    });

    return category;
};

const remove = async (id: number, companyId: number) => {
    const category = await CategoryRepository.findById(id, companyId);

    if (!category) {
        throw { status: 404, messageCode: messageCodes.common.messages.NOT_FOUND };
    }

    // TODO: verificar vínculos com products quando a tabela existir
    // const linkedProducts = await ProductRepository.countByCategory(id, companyId);
    // if (linkedProducts > 0) {
    //     throw { status: 400, messageCode: messageCodes.categories.errors.HAS_LINKED_PRODUCTS };
    // }

    await AppDataSource.transaction(async (manager) => {
        await manager.remove(category);
    });
};

export default { findAll, findById, create, update, toggleStatus, remove };
