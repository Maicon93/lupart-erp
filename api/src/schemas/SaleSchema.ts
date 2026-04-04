import { z } from 'zod';
import messageCodes from '../i18n/MessageCodes';

const saleItemSchema = z.object({
    productId: z.number({ message: messageCodes.common.validations.REQUIRED_FIELD }).int().positive(),
    quantity: z.number({ message: messageCodes.common.validations.REQUIRED_FIELD }).positive(messageCodes.common.validations.REQUIRED_FIELD),
    unitPrice: z.number({ message: messageCodes.common.validations.REQUIRED_FIELD }).positive(messageCodes.common.validations.REQUIRED_FIELD),
});

const saleInstallmentSchema = z.object({
    paymentTypeId: z.number({ message: messageCodes.common.validations.REQUIRED_FIELD }).int().positive(),
    value: z.number({ message: messageCodes.common.validations.REQUIRED_FIELD }).positive(messageCodes.common.validations.REQUIRED_FIELD),
    dueDate: z.string({ message: messageCodes.common.validations.REQUIRED_FIELD }).min(1, messageCodes.common.validations.REQUIRED_FIELD),
    paid: z.boolean().default(false),
});

export const createSaleSchema = z.object({
    customerId: z.number({ message: messageCodes.common.validations.REQUIRED_FIELD }).int().positive(),
    date: z.string({ message: messageCodes.common.validations.REQUIRED_FIELD }).min(1, messageCodes.common.validations.REQUIRED_FIELD),
    observation: z.string().trim().optional().or(z.literal('')),
    discountPercentage: z.number().min(0, messageCodes.sales.validations.INVALID_DISCOUNT).max(100, messageCodes.sales.validations.INVALID_DISCOUNT).default(0),
    discountValue: z.number().min(0, messageCodes.sales.validations.INVALID_DISCOUNT).default(0),
    totalValue: z.number({ message: messageCodes.common.validations.REQUIRED_FIELD }).positive(),
    finalValue: z.number({ message: messageCodes.common.validations.REQUIRED_FIELD }).positive(),
    paymentForm: z.enum(['cash', 'installment'], { message: messageCodes.common.validations.REQUIRED_FIELD }),
    items: z.array(saleItemSchema).min(1, messageCodes.common.validations.REQUIRED_FIELD),
    installments: z.array(saleInstallmentSchema).min(1, messageCodes.common.validations.REQUIRED_FIELD),
});

export const cancelSaleSchema = z.object({
    reason: z.string({ message: messageCodes.common.validations.REQUIRED_FIELD }).trim().min(1, messageCodes.common.validations.REQUIRED_FIELD),
});
