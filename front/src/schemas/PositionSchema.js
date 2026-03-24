import { z } from 'zod';

export const positionSchema = z.object({
    name: z.string().nonempty('common.validations.REQUIRED_FIELD').max(255),
    permissions: z.array(z.number()).min(1, 'positions.validations.AT_LEAST_ONE_PERMISSION'),
});
