import { z } from 'zod';

export const productSchema = z.object({
    type: z.enum(['product', 'service'], { message: 'common.validations.REQUIRED_FIELD' }),
    name: z.string().min(1, 'common.validations.REQUIRED_FIELD').max(255),
    code: z.string().optional().or(z.literal('')),
    barcode: z.string().optional().or(z.literal('')),
    description: z.string().optional().or(z.literal('')),
    categoryId: z.number({ invalid_type_error: 'common.validations.REQUIRED_FIELD' }).int().positive('common.validations.REQUIRED_FIELD'),
    measurementUnitId: z.number().int().positive().optional().nullable(),
    salePrice: z.number({ invalid_type_error: 'common.validations.REQUIRED_FIELD' }).positive('products.validations.POSITIVE_PRICE'),
    averageCost: z.number().min(0).optional().nullable(),
    minimumStock: z.number().min(0).optional().nullable(),
    notes: z.string().optional().or(z.literal('')),
});
