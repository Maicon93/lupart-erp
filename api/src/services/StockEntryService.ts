import { AppDataSource } from '../config/database';
import { StockEntry } from '../models/StockEntry';
import { StockEntryItem } from '../models/StockEntryItem';
import { Product } from '../models/Product';
import { ProductMovimentation, ProductMovimentationType } from '../models/ProductMovimentation';
import StockEntryRepository from '../repositories/StockEntryRepository';
import { checkInventoryLock } from '../helpers/InventoryLock';
import messageCodes from '../i18n/MessageCodes';

interface IStockEntryItemInput {
    productId: number;
    quantity: number;
    unitPrice?: number | null;
}

interface IStockEntryInput {
    supplierId?: number | null;
    invoiceNumber?: string;
    observation?: string;
    items: IStockEntryItemInput[];
}

export default class StockEntryService {
    private stockEntryRepository = new StockEntryRepository();

    async findAll(
        companyId: number,
        search?: string,
        supplierId?: number,
        dateStart?: string,
        dateEnd?: string,
        createdBy?: string,
        page = 1,
        limit = 20
    ) {
        return this.stockEntryRepository.findAll(companyId, search, supplierId, dateStart, dateEnd, createdBy, page, limit);
    }

    async findById(id: number, companyId: number) {
        const entry = await this.stockEntryRepository.findById(id, companyId);

        if (!entry) {
            throw { status: 404, messageCode: messageCodes.common.messages.NOT_FOUND };
        }

        const items = await this.stockEntryRepository.findItemsByEntryId(id);

        return { ...entry, items };
    }

    async create(companyId: number, userId: number, input: IStockEntryInput) {
        const productIds = input.items.map((item) => item.productId);
        await checkInventoryLock(productIds, companyId);

        const result = await AppDataSource.transaction(async (manager) => {
            let totalValue: number | null = null;

            const entry = manager.create(StockEntry, {
                companyId,
                supplierId: input.supplierId ?? undefined,
                invoiceNumber: input.invoiceNumber ?? undefined,
                observation: input.observation ?? undefined,
                totalValue: 0,
                createdBy: userId,
            });

            const savedEntry = await manager.save(entry);

            for (const itemInput of input.items) {
                const product = await manager.findOne(Product, {
                    where: { id: itemInput.productId, companyId },
                });

                if (!product) {
                    throw { status: 404, messageCode: messageCodes.stockEntries.errors.PRODUCT_NOT_FOUND };
                }

                const subtotal = itemInput.unitPrice ? itemInput.quantity * itemInput.unitPrice : null;

                if (subtotal !== null) {
                    totalValue = (totalValue ?? 0) + subtotal;
                }

                const item = manager.create(StockEntryItem, {
                    stockEntryId: savedEntry.id,
                    productId: itemInput.productId,
                    quantity: itemInput.quantity,
                    unitPrice: itemInput.unitPrice ?? undefined,
                    subtotal: subtotal ?? undefined,
                });

                const savedItem = await manager.save(item);

                const previousStock = Number(product.stock);
                const newStock = previousStock + itemInput.quantity;

                await manager.update(Product, product.id, { stock: newStock });

                if (itemInput.unitPrice && itemInput.unitPrice > 0) {
                    const previousCost = Number(product.averageCost);
                    const newAverageCost =
                        previousStock + itemInput.quantity > 0
                            ? (previousStock * previousCost + itemInput.quantity * itemInput.unitPrice) /
                              (previousStock + itemInput.quantity)
                            : itemInput.unitPrice;

                    await manager.update(Product, product.id, {
                        averageCost: Math.round(newAverageCost * 100) / 100,
                    });
                }

                const movimentation = manager.create(ProductMovimentation, {
                    companyId,
                    productId: itemInput.productId,
                    type: ProductMovimentationType.ENTRY,
                    referenceId: savedItem.id,
                    previousQuantity: previousStock,
                    newQuantity: newStock,
                    amount: itemInput.quantity,
                    value: subtotal ?? undefined,
                    createdBy: userId,
                });

                await manager.save(movimentation);
            }

            if (totalValue !== null) {
                await manager.update(StockEntry, savedEntry.id, { totalValue });
            }

            return savedEntry;
        });

        return result;
    }
}

