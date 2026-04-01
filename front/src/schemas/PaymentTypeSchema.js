import { z } from 'zod';

export const paymentTypeSchema = z.object({
    name: z.string().min(1, 'common.validations.REQUIRED_FIELD').max(255),
    observation: z.string().optional().or(z.literal('')),
});
