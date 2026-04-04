import { z } from 'zod';

const saleItemSchema = z.object({
    productId: z.number({ invalid_type_error: 'common.validations.REQUIRED_FIELD' }).int().positive('common.validations.REQUIRED_FIELD'),
    quantity: z.number({ invalid_type_error: 'common.validations.REQUIRED_FIELD' }).positive('sales.validations.POSITIVE_QUANTITY'),
    unitPrice: z.number({ invalid_type_error: 'common.validations.REQUIRED_FIELD' }).positive('sales.validations.POSITIVE_PRICE'),
});

const saleInstallmentSchema = z.object({
    paymentTypeId: z.number({ invalid_type_error: 'common.validations.REQUIRED_FIELD' }).int().positive('common.validations.REQUIRED_FIELD'),
    value: z.number({ invalid_type_error: 'common.validations.REQUIRED_FIELD' }).positive('sales.validations.POSITIVE_PRICE'),
    dueDate: z.string({ invalid_type_error: 'common.validations.REQUIRED_FIELD' }).min(1, 'common.validations.REQUIRED_FIELD'),
    paid: z.boolean().default(false),
});

export const saleSchema = z.object({
    customerId: z.number({ invalid_type_error: 'common.validations.REQUIRED_FIELD' }).int().positive('common.validations.REQUIRED_FIELD'),
    date: z.string({ invalid_type_error: 'common.validations.REQUIRED_FIELD' }).min(1, 'common.validations.REQUIRED_FIELD'),
    observation: z.string().optional().or(z.literal('')),
    discountPercentage: z.number({ invalid_type_error: 'common.validations.REQUIRED_FIELD' }).min(0, 'sales.validations.DISCOUNT_RANGE').max(100, 'sales.validations.DISCOUNT_RANGE').default(0),
    discountValue: z.number({ invalid_type_error: 'common.validations.REQUIRED_FIELD' }).min(0, 'sales.validations.DISCOUNT_RANGE').default(0),
    totalValue: z.number({ invalid_type_error: 'common.validations.REQUIRED_FIELD' }).positive('common.validations.REQUIRED_FIELD'),
    finalValue: z.number({ invalid_type_error: 'common.validations.REQUIRED_FIELD' }).positive('common.validations.REQUIRED_FIELD'),
    paymentForm: z.enum(['cash', 'installment'], { message: 'common.validations.REQUIRED_FIELD' }),
    items: z.array(saleItemSchema).min(1, 'sales.validations.AT_LEAST_ONE_ITEM'),
    installments: z.array(saleInstallmentSchema).min(1, 'common.validations.REQUIRED_FIELD'),
});
