import { z } from 'zod';

export const createPositionSchema = z.object({
    name: z.string().trim().nonempty().max(255),
    permissions: z.array(z.number().int().positive()).min(1),
});

export const updatePositionSchema = createPositionSchema;
