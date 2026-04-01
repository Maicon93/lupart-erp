import { z } from 'zod';

export const createCategorySchema = z.object({
    name: z.string().trim().min(1).max(255),
    observation: z.string().trim().optional().or(z.literal('')),
});

export const updateCategorySchema = createCategorySchema;
