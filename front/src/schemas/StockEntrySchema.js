import { z } from 'zod';

const stockEntryItemSchema = z.object({
    productId: z.number({ invalid_type_error: 'common.validations.REQUIRED_FIELD' }).int().positive(),
    quantity: z.number({ invalid_type_error: 'common.validations.REQUIRED_FIELD' }).positive('stockEntries.validations.POSITIVE_QUANTITY'),
    unitPrice: z.number().positive().optional().nullable(),
});

export const stockEntrySchema = z.object({
    supplierId: z.number().int().positive().optional().nullable(),
    invoiceNumber: z.string().optional().or(z.literal('')),
    observation: z.string().optional().or(z.literal('')),
    items: z.array(stockEntryItemSchema).min(1, 'stockEntries.validations.AT_LEAST_ONE_ITEM'),
});
