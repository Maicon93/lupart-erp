import { z } from 'zod';

export const loginSchema = z.object({
    email: z.string().nonempty('common.validations.REQUIRED_FIELD').email('common.validations.INVALID_EMAIL'),
    password: z.string().nonempty('common.validations.REQUIRED_FIELD'),
});
