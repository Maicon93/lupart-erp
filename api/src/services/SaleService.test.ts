import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockSaleRepository = vi.hoisted(() => ({
    findAll: vi.fn(),
    findById: vi.fn(),
    findItemsBySaleId: vi.fn(),
    findPaymentBySaleId: vi.fn(),
}));

const mockTransaction = vi.hoisted(() => vi.fn());

vi.mock('../config/database', () => ({
    AppDataSource: { transaction: mockTransaction },
}));

vi.mock('../repositories/SaleRepository', () => ({
    default: class MockSaleRepository {
        findAll = mockSaleRepository.findAll;
        findById = mockSaleRepository.findById;
        findItemsBySaleId = mockSaleRepository.findItemsBySaleId;
        findPaymentBySaleId = mockSaleRepository.findPaymentBySaleId;
    },
}));

vi.mock('../helpers/InventoryLock', () => ({
    checkInventoryLock: vi.fn().mockResolvedValue(undefined),
}));

vi.mock('../helpers/Logger', () => ({
    default: { warn: vi.fn(), info: vi.fn(), error: vi.fn() },
}));

import SaleService from './SaleService';
import { SaleStatus } from '../models/Sale';
import { FinancialTitleStatus } from '../models/FinancialTitle';
import { ProductType } from '../models/Product';
import messageCodes from '../i18n/MessageCodes';

function buildMockManager(overrides: Record<string, unknown> = {}) {
    return {
        create: vi.fn((_Entity: unknown, data: unknown) => data),
        save: vi.fn((entity: unknown) => Promise.resolve({ ...(entity as object), id: 1 })),
        findOne: vi.fn(),
        find: vi.fn(),
        update: vi.fn().mockResolvedValue(undefined),
        createQueryBuilder: vi.fn(() => ({
            update: vi.fn().mockReturnThis(),
            set: vi.fn().mockReturnThis(),
            where: vi.fn().mockReturnThis(),
            execute: vi.fn().mockResolvedValue(undefined),
        })),
        ...overrides,
    };
}

const companyId = 1;
const userId = 10;

describe('SaleService', () => {
    let service: SaleService;

    beforeEach(() => {
        vi.clearAllMocks();
        service = new SaleService();
    });

    describe('findById', () => {
        it('throws NOT_FOUND when sale does not exist', async () => {
            mockSaleRepository.findById.mockResolvedValue(null);

            await expect(service.findById(99, companyId)).rejects.toMatchObject({
                status: 404,
                messageCode: messageCodes.sales.errors.NOT_FOUND,
            });
        });

        it('returns sale with items when found', async () => {
            const sale = { id: 1, companyId };
            const items = [{ id: 1, productId: 2, quantity: 3 }];
            mockSaleRepository.findById.mockResolvedValue(sale);
            mockSaleRepository.findItemsBySaleId.mockResolvedValue(items);

            const result = await service.findById(1, companyId);

            expect(result).toEqual({ ...sale, items });
        });
    });

    describe('cancel', () => {
        it('throws NOT_FOUND when sale does not exist', async () => {
            mockSaleRepository.findById.mockResolvedValue(null);

            await expect(service.cancel(99, companyId, userId, 'motivo')).rejects.toMatchObject({
                status: 404,
                messageCode: messageCodes.sales.errors.NOT_FOUND,
            });
        });

        it('throws ALREADY_CANCELLED when sale is already cancelled', async () => {
            mockSaleRepository.findById.mockResolvedValue({
                id: 1,
                companyId,
                status: SaleStatus.CANCELLED,
            });

            await expect(service.cancel(1, companyId, userId, 'motivo')).rejects.toMatchObject({
                status: 400,
                messageCode: messageCodes.sales.errors.ALREADY_CANCELLED,
            });
        });

        it('cancels sale and reverts product stock', async () => {
            mockSaleRepository.findById.mockResolvedValue({
                id: 1,
                companyId,
                status: SaleStatus.FINALIZED,
            });

            const mockManager = buildMockManager({
                find: vi.fn().mockResolvedValue([
                    { id: 1, productId: 10, quantity: 5, subtotal: 50 },
                ]),
                findOne: vi.fn().mockResolvedValue({
                    id: 10,
                    companyId,
                    type: ProductType.PRODUCT,
                    stock: 3,
                }),
            });

            mockTransaction.mockImplementation(async (callback: (manager: unknown) => Promise<unknown>) => callback(mockManager));

            await service.cancel(1, companyId, userId, 'motivo');

            expect(mockManager.update).toHaveBeenCalledWith(
                expect.anything(),
                10,
                expect.objectContaining({ stock: 8 })
            );
        });
    });

    describe('create', () => {
        const baseInstallment = {
            paymentTypeId: 1,
            value: 100,
            dueDate: '2025-01-01',
            paid: false,
        };

        const baseInput = {
            customerId: 1,
            date: '2025-01-01',
            discountPercentage: 0,
            discountValue: 0,
            totalValue: 100,
            finalValue: 100,
            paymentForm: 'cash' as const,
            items: [{ productId: 1, quantity: 2, unitPrice: 50 }],
            installments: [baseInstallment],
        };

        it('throws INSUFFICIENT_STOCK when product stock is not enough and allowNegativeStock is false', async () => {
            const mockManager = buildMockManager({
                findOne: vi.fn()
                    .mockResolvedValueOnce({ companyId, allowNegativeStock: false })
                    .mockResolvedValueOnce({ id: 1, companyId, type: ProductType.PRODUCT, stock: 1 }),
            });

            mockTransaction.mockImplementation(async (callback: (manager: unknown) => Promise<unknown>) => callback(mockManager));

            await expect(service.create(companyId, userId, baseInput)).rejects.toMatchObject({
                status: 400,
                messageCode: messageCodes.sales.errors.INSUFFICIENT_STOCK,
            });
        });

        it('allows creation when allowNegativeStock is true even with insufficient stock', async () => {
            const savedSale = { id: 5, companyId };

            const mockManager = buildMockManager({
                save: vi.fn()
                    .mockResolvedValueOnce(savedSale)
                    .mockResolvedValue({}),
                findOne: vi.fn()
                    .mockResolvedValueOnce({ companyId, allowNegativeStock: true })
                    .mockResolvedValueOnce({ id: 1, companyId, type: ProductType.PRODUCT, stock: 1 }),
            });

            mockTransaction.mockImplementation(async (callback: (manager: unknown) => Promise<unknown>) => callback(mockManager));

            const result = await service.create(companyId, userId, baseInput);

            expect(result).toEqual(savedSale);
        });

        it('creates installment with PAID status and paymentDate when paid flag is true', async () => {
            const savedSale = { id: 5, companyId };
            const createdEntities: unknown[] = [];

            const mockManager = buildMockManager({
                save: vi.fn()
                    .mockResolvedValueOnce(savedSale)
                    .mockResolvedValue({}),
                findOne: vi.fn()
                    .mockResolvedValueOnce({ companyId, allowNegativeStock: false })
                    .mockResolvedValueOnce({ id: 1, companyId, type: ProductType.PRODUCT, stock: 10 }),
                create: vi.fn((_Entity: unknown, data: unknown) => {
                    createdEntities.push(data);
                    return data;
                }),
            });

            mockTransaction.mockImplementation(async (callback: (manager: unknown) => Promise<unknown>) => callback(mockManager));

            await service.create(companyId, userId, {
                ...baseInput,
                installments: [{ ...baseInstallment, paid: true }],
            });

            const titleData = createdEntities.find(
                (entity) =>
                    typeof entity === 'object' &&
                    entity !== null &&
                    'status' in entity &&
                    (entity as Record<string, unknown>).status === FinancialTitleStatus.PAID
            ) as Record<string, unknown> | undefined;

            expect(titleData).toBeDefined();
            expect(titleData?.paymentDate).toBeDefined();
        });

        it('creates installment with PENDING status and no paymentDate when paid flag is false', async () => {
            const savedSale = { id: 5, companyId };
            const createdEntities: unknown[] = [];

            const mockManager = buildMockManager({
                save: vi.fn()
                    .mockResolvedValueOnce(savedSale)
                    .mockResolvedValue({}),
                findOne: vi.fn()
                    .mockResolvedValueOnce({ companyId, allowNegativeStock: false })
                    .mockResolvedValueOnce({ id: 1, companyId, type: ProductType.PRODUCT, stock: 10 }),
                create: vi.fn((_Entity: unknown, data: unknown) => {
                    createdEntities.push(data);
                    return data;
                }),
            });

            mockTransaction.mockImplementation(async (callback: (manager: unknown) => Promise<unknown>) => callback(mockManager));

            await service.create(companyId, userId, baseInput);

            const titleData = createdEntities.find(
                (entity) =>
                    typeof entity === 'object' &&
                    entity !== null &&
                    'status' in entity &&
                    (entity as Record<string, unknown>).status === FinancialTitleStatus.PENDING
            ) as Record<string, unknown> | undefined;

            expect(titleData).toBeDefined();
            expect(titleData?.paymentDate).toBeUndefined();
        });

        it('calculates subtotal correctly for each item', async () => {
            const savedSale = { id: 5, companyId };
            const createdEntities: unknown[] = [];

            const mockManager = buildMockManager({
                save: vi.fn()
                    .mockResolvedValueOnce(savedSale)
                    .mockResolvedValue({}),
                findOne: vi.fn()
                    .mockResolvedValueOnce({ companyId, allowNegativeStock: false })
                    .mockResolvedValueOnce({ id: 1, companyId, type: ProductType.PRODUCT, stock: 10 }),
                create: vi.fn((_Entity: unknown, data: unknown) => {
                    createdEntities.push(data);
                    return data;
                }),
            });

            mockTransaction.mockImplementation(async (callback: (manager: unknown) => Promise<unknown>) => callback(mockManager));

            await service.create(companyId, userId, {
                ...baseInput,
                items: [{ productId: 1, quantity: 4, unitPrice: 25 }],
            });

            const itemData = createdEntities.find(
                (entity) =>
                    typeof entity === 'object' &&
                    entity !== null &&
                    'subtotal' in entity
            ) as Record<string, unknown> | undefined;

            expect(itemData?.subtotal).toBe(100);
        });
    });
});
