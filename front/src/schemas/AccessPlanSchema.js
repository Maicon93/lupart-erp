import { z } from 'zod';

export const accessPlanSchema = z.object({
    title: z.string().nonempty('common.validations.REQUIRED_FIELD'),
    userLimit: z.number({ invalid_type_error: 'common.validations.REQUIRED_FIELD' }).int().positive('accessPlans.validations.POSITIVE_NUMBER'),
    durationDays: z.number({ invalid_type_error: 'common.validations.REQUIRED_FIELD' }).int().positive('accessPlans.validations.POSITIVE_NUMBER'),
    price: z.number({ invalid_type_error: 'common.validations.REQUIRED_FIELD' }).positive('accessPlans.validations.POSITIVE_NUMBER'),
});
