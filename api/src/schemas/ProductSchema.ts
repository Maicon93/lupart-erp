import { z } from 'zod';

export const createProductSchema = z
    .object({
        type: z.enum(['product', 'service']),
        name: z.string().trim().min(1).max(255),
        code: z.string().trim().optional().or(z.literal('')),
        barcode: z.string().trim().optional().or(z.literal('')),
        description: z.string().trim().optional().or(z.literal('')),
        categoryId: z.number().int().positive(),
        measurementUnitId: z.number().int().positive().optional().nullable(),
        salePrice: z.number().positive(),
        averageCost: z.number().min(0).optional().nullable(),
        minimumStock: z.number().min(0).optional().nullable(),
        notes: z.string().trim().optional().or(z.literal('')),
    })
    .refine(
        (data) => data.type === 'service' || (data.measurementUnitId != null && data.measurementUnitId > 0),
        { path: ['measurementUnitId'] }
    );

export const updateProductSchema = createProductSchema;
