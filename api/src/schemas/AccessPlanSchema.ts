import { z } from 'zod';

export const createAccessPlanSchema = z.object({
    title: z.string().nonempty().max(255),
    userLimit: z.number().int().positive(),
    durationDays: z.number().int().positive(),
    price: z.number().positive(),
});

export const updateAccessPlanSchema = createAccessPlanSchema;
