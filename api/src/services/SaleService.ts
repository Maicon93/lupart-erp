import { AppDataSource } from '../config/database';
import { Sale, SalePaymentForm, SaleStatus } from '../models/Sale';
import { SaleItem } from '../models/SaleItem';
import { FinancialTitle, FinancialTitleOrigin, FinancialTitleStatus, FinancialTitleType } from '../models/FinancialTitle';
import { Product, ProductType } from '../models/Product';
import { CompanySetting } from '../models/CompanySetting';
import { ProductMovimentation, ProductMovimentationType } from '../models/ProductMovimentation';
import SaleRepository from '../repositories/SaleRepository';
import { checkInventoryLock } from '../helpers/InventoryLock';
import messageCodes from '../i18n/MessageCodes';
import logger from '../helpers/Logger';

interface ISaleItemInput {
    productId: number;
    quantity: number;
    unitPrice: number;
}

interface ISaleInstallmentInput {
    paymentTypeId: number;
    value: number;
    dueDate: string;
    paid: boolean;
}

interface ISaleInput {
    customerId: number;
    date: string;
    observation?: string;
    discountPercentage: number;
    discountValue: number;
    totalValue: number;
    finalValue: number;
    paymentForm: 'cash' | 'installment';
    items: ISaleItemInput[];
    installments: ISaleInstallmentInput[];
}

export default class SaleService {
    private saleRepository = new SaleRepository();

    async findAll(
        companyId: number,
        search?: string,
        customerId?: number,
        dateStart?: string,
        dateEnd?: string,
        page = 1,
        limit = 20
    ) {
        return this.saleRepository.findAll(companyId, search, customerId, dateStart, dateEnd, page, limit);
    }

    async findById(id: number, companyId: number) {
        const sale = await this.saleRepository.findById(id, companyId);

        if (!sale) {
            throw { status: 404, messageCode: messageCodes.sales.errors.NOT_FOUND };
        }

        const items = await this.saleRepository.findItemsBySaleId(id);

        return { ...sale, items };
    }

    async findPayment(id: number, companyId: number) {
        const sale = await this.saleRepository.findById(id, companyId);

        if (!sale) {
            throw { status: 404, messageCode: messageCodes.sales.errors.NOT_FOUND };
        }

        const titles = await this.saleRepository.findPaymentBySaleId(id, companyId);

        return { paymentForm: sale.paymentForm, titles };
    }

    async create(companyId: number, userId: number, input: ISaleInput) {
        const productIds = input.items.map((item) => item.productId);
        await checkInventoryLock(productIds, companyId);

        const result = await AppDataSource.transaction(async (manager) => {
            const sale = manager.create(Sale, {
                companyId,
                customerId: input.customerId,
                date: input.date as unknown as Date,
                observation: input.observation ?? undefined,
                status: SaleStatus.FINALIZED,
                paymentForm: input.paymentForm as SalePaymentForm,
                discountPercentage: input.discountPercentage,
                discountValue: input.discountValue,
                totalValue: input.totalValue,
                finalValue: input.finalValue,
                createdBy: userId,
            });

            const savedSale = await manager.save(sale);

            const setting = await manager.findOne(CompanySetting, { where: { companyId } });

            if (!setting) {
                throw { status: 500, messageCode: messageCodes.common.messages.ERROR };
            }

            const allowNegativeStock = setting.allowNegativeStock;

            for (const itemInput of input.items) {
                const product = await manager.findOne(Product, {
                    where: { id: itemInput.productId, companyId },
                });

                if (!product) {
                    throw { status: 404, messageCode: messageCodes.sales.errors.PRODUCT_NOT_FOUND };
                }

                const isProduct = product.type === ProductType.PRODUCT;

                if (isProduct && !allowNegativeStock) {
                    const currentStock = Number(product.stock);
                    if (itemInput.quantity > currentStock) {
                        throw { status: 400, messageCode: messageCodes.sales.errors.INSUFFICIENT_STOCK };
                    }
                }

                const subtotal = Math.round(itemInput.quantity * itemInput.unitPrice * 100) / 100;

                const item = manager.create(SaleItem, {
                    saleId: savedSale.id,
                    productId: itemInput.productId,
                    quantity: itemInput.quantity,
                    unitPrice: itemInput.unitPrice,
                    subtotal,
                });

                const savedItem = await manager.save(item);

                if (isProduct) {
                    const previousStock = Number(product.stock);
                    const newStock = previousStock - itemInput.quantity;

                    await manager.update(Product, product.id, { stock: newStock });

                    const movimentation = manager.create(ProductMovimentation, {
                        companyId,
                        productId: itemInput.productId,
                        type: ProductMovimentationType.SALE,
                        referenceId: savedItem.id,
                        previousQuantity: previousStock,
                        newQuantity: newStock,
                        amount: -itemInput.quantity,
                        value: subtotal,
                        createdBy: userId,
                    });

                    await manager.save(movimentation);
                }
            }

            const installmentCount = input.installments.length;

            for (let index = 0; index < installmentCount; index++) {
                const installmentInput = input.installments[index];

                const isPaid = installmentInput.paid === true;

                const title = manager.create(FinancialTitle, {
                    companyId,
                    customerId: input.customerId,
                    type: FinancialTitleType.INFLOW,
                    origin: FinancialTitleOrigin.SALE,
                    referenceId: savedSale.id,
                    value: installmentInput.value,
                    dueDate: installmentInput.dueDate as unknown as Date,
                    paymentTypeId: installmentInput.paymentTypeId,
                    status: isPaid ? FinancialTitleStatus.PAID : FinancialTitleStatus.PENDING,
                    paymentDate: isPaid ? new Date() : undefined,
                    createdBy: userId,
                });

                await manager.save(title);
            }

            return savedSale;
        });

        return result;
    }

    async cancel(id: number, companyId: number, userId: number, reason: string) {
        const sale = await this.saleRepository.findById(id, companyId);

        if (!sale) {
            throw { status: 404, messageCode: messageCodes.sales.errors.NOT_FOUND };
        }

        if (sale.status === SaleStatus.CANCELLED) {
            throw { status: 400, messageCode: messageCodes.sales.errors.ALREADY_CANCELLED };
        }

        await AppDataSource.transaction(async (manager) => {
            await manager.update(Sale, id, {
                status: SaleStatus.CANCELLED,
                cancellationReason: reason,
            });

            const items = await manager.find(SaleItem, {
                where: { saleId: id },
                relations: ['product', 'product.measurementUnit'],
                order: { id: 'ASC' },
            });

            for (const item of items) {
                const product = await manager.findOne(Product, {
                    where: { id: item.productId, companyId },
                });

                if (!product) {
                    logger.warn(`Product not found during sale cancellation`, { productId: item.productId, saleId: id, companyId });
                    continue;
                }

                if (product.type === ProductType.PRODUCT) {
                    const previousStock = Number(product.stock);
                    const newStock = previousStock + Number(item.quantity);

                    await manager.update(Product, product.id, { stock: newStock });

                    const movimentation = manager.create(ProductMovimentation, {
                        companyId,
                        productId: item.productId,
                        type: ProductMovimentationType.SALE_RETURN,
                        referenceId: item.id,
                        previousQuantity: previousStock,
                        newQuantity: newStock,
                        amount: Number(item.quantity),
                        value: Number(item.subtotal),
                        createdBy: userId,
                    });

                    await manager.save(movimentation);
                }
            }

            await manager
                .createQueryBuilder()
                .update(FinancialTitle)
                .set({ status: FinancialTitleStatus.CANCELLED })
                .where('reference_id = :referenceId AND origin = :origin AND company_id = :companyId', {
                    referenceId: id,
                    origin: FinancialTitleOrigin.SALE,
                    companyId,
                })
                .execute();
        });
    }
}
