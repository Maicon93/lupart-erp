import { z } from 'zod';

export const measurementUnitSchema = z.object({
    abbreviation: z.string().min(1, 'common.validations.REQUIRED_FIELD').max(10),
    description: z.string().min(1, 'common.validations.REQUIRED_FIELD').max(255),
});
