import { AppDataSource } from '../config/database';
import { Category, CategoryStatus } from '../models/Category';
import CategoryRepository from '../repositories/CategoryRepository';
import messageCodes from '../i18n/MessageCodes';
import { IBasicEntityInput } from '../interfaces/IBasicEntityInput';

export default class CategoryService {
    static async findAll(companyId: number, search?: string, status?: string, page = 1, limit = 20) {
        return CategoryRepository.findAll(companyId, search, status, page, limit);
    }

    static async findById(id: number, companyId: number) {
        const category = await CategoryRepository.findById(id, companyId);

        if (!category) {
            throw { status: 404, messageCode: messageCodes.common.messages.NOT_FOUND };
        }

        return category;
    }

    static async create(companyId: number, input: IBasicEntityInput) {
        const existing = await CategoryRepository.findByName(input.name, companyId);

        if (existing) {
            throw { status: 400, messageCode: messageCodes.categories.errors.NAME_ALREADY_EXISTS };
        }

        const result = await AppDataSource.transaction(async (manager) => {
            const category = manager.create(Category, {
                companyId,
                name: input.name,
                observation: input.observation ?? undefined,
                status: CategoryStatus.ACTIVE,
            });

            return manager.save(category);
        });

        return result;
    }

    static async update(id: number, companyId: number, input: IBasicEntityInput) {
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
            category.observation = input.observation ?? null as unknown as string;
            await manager.save(category);
        });

        return category;
    }

    static async toggleStatus(id: number, companyId: number) {
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
    }

    static async remove(id: number, companyId: number) {
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
    }
}

