import { AppDataSource } from '../config/database';
import { Product, ProductType, ProductStatus } from '../models/Product';
import ProductRepository from '../repositories/ProductRepository';
import messageCodes from '../i18n/MessageCodes';

interface IProductInput {
    type: string;
    name: string;
    code?: string;
    barcode?: string;
    description?: string;
    categoryId: number;
    measurementUnitId?: number;
    salePrice: number;
    averageCost?: number;
    minimumStock?: number;
    notes?: string;
}

const findAll = async (
    companyId: number,
    search?: string,
    type?: string,
    categoryId?: number,
    status?: string,
    page = 1,
    limit = 20
) => {
    return ProductRepository.findAll(companyId, search, type, categoryId, status, page, limit);
};

const findById = async (id: number, companyId: number) => {
    const product = await ProductRepository.findById(id, companyId);

    if (!product) {
        throw { status: 404, messageCode: messageCodes.common.messages.NOT_FOUND };
    }

    return product;
};

const create = async (companyId: number, input: IProductInput) => {
    if (input.code) {
        const existing = await ProductRepository.findByCode(input.code, companyId);

        if (existing) {
            throw { status: 400, messageCode: messageCodes.products.errors.CODE_ALREADY_EXISTS };
        }
    }

    const isService = input.type === ProductType.SERVICE;

    const result = await AppDataSource.transaction(async (manager) => {
        const product = manager.create(Product, {
            companyId,
            type: input.type as ProductType,
            name: input.name,
            code: input.code || undefined,
            barcode: isService ? undefined : input.barcode || undefined,
            description: input.description || undefined,
            categoryId: input.categoryId,
            measurementUnitId: isService ? undefined : input.measurementUnitId || undefined,
            salePrice: input.salePrice,
            averageCost: isService ? 0 : input.averageCost || 0,
            stock: 0,
            minimumStock: isService ? undefined : input.minimumStock || undefined,
            notes: input.notes || undefined,
            status: ProductStatus.ACTIVE,
        });

        return manager.save(product);
    });

    return result;
};

const update = async (id: number, companyId: number, input: IProductInput) => {
    const product = await ProductRepository.findById(id, companyId);

    if (!product) {
        throw { status: 404, messageCode: messageCodes.common.messages.NOT_FOUND };
    }

    if (input.code) {
        const existing = await ProductRepository.findByCode(input.code, companyId);

        if (existing && existing.id !== id) {
            throw { status: 400, messageCode: messageCodes.products.errors.CODE_ALREADY_EXISTS };
        }
    }

    const isService = input.type === ProductType.SERVICE;

    await AppDataSource.transaction(async (manager) => {
        product.type = input.type as ProductType;
        product.name = input.name;
        product.code = input.code || null as unknown as string;
        product.barcode = isService ? null as unknown as string : input.barcode || null as unknown as string;
        product.description = input.description || null as unknown as string;
        product.categoryId = input.categoryId;
        product.measurementUnitId = isService ? null as unknown as number : input.measurementUnitId || null as unknown as number;
        product.salePrice = input.salePrice;
        product.averageCost = isService ? 0 : input.averageCost ?? product.averageCost;
        product.minimumStock = isService ? null as unknown as number : input.minimumStock || null as unknown as number;
        product.notes = input.notes || null as unknown as string;
        await manager.save(product);
    });

    return product;
};

const toggleStatus = async (id: number, companyId: number) => {
    const product = await ProductRepository.findById(id, companyId);

    if (!product) {
        throw { status: 404, messageCode: messageCodes.common.messages.NOT_FOUND };
    }

    await AppDataSource.transaction(async (manager) => {
        product.status =
            product.status === ProductStatus.ACTIVE
                ? ProductStatus.INACTIVE
                : ProductStatus.ACTIVE;
        await manager.save(product);
    });

    return product;
};

export default { findAll, findById, create, update, toggleStatus };
