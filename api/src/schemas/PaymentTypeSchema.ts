import { z } from 'zod';

export const createPaymentTypeSchema = z.object({
    name: z.string().trim().min(1).max(255),
    observation: z.string().trim().optional().or(z.literal('')),
});

export const updatePaymentTypeSchema = createPaymentTypeSchema;
