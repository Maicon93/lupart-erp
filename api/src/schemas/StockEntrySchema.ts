import { z } from 'zod';
import messageCodes from '../i18n/MessageCodes';

const stockEntryItemSchema = z.object({
    productId: z.number({ message: messageCodes.common.validations.REQUIRED_FIELD }).int().positive(),
    quantity: z.number({ message: messageCodes.common.validations.REQUIRED_FIELD }).positive(messageCodes.common.validations.REQUIRED_FIELD),
    unitPrice: z.union([z.number().positive(), z.null()]).optional(),
});

export const createStockEntrySchema = z.object({
    supplierId: z.union([z.number().int().positive(), z.null()]).optional(),
    invoiceNumber: z.string().trim().optional().or(z.literal('')),
    observation: z.string().trim().optional().or(z.literal('')),
    items: z.array(stockEntryItemSchema).min(1, messageCodes.common.validations.REQUIRED_FIELD),
});
