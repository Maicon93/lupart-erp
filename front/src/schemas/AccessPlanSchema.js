import { z } from 'zod';

const requiredNumber = (extra) =>
    z.preprocess(
        (val) => (val === null || val === '' ? undefined : val),
        z.number({ required_error: 'common.validations.REQUIRED_FIELD', invalid_type_error: 'common.validations.REQUIRED_FIELD' }).int().positive(extra),
    );

export const accessPlanSchema = z.object({
    title: z.string().nonempty('common.validations.REQUIRED_FIELD'),
    userLimit: requiredNumber('accessPlans.validations.POSITIVE_NUMBER'),
    durationDays: requiredNumber('accessPlans.validations.POSITIVE_NUMBER'),
    price: z.preprocess(
        (val) => (val === null || val === '' ? undefined : val),
        z.number({ required_error: 'common.validations.REQUIRED_FIELD', invalid_type_error: 'common.validations.REQUIRED_FIELD' }).positive('accessPlans.validations.POSITIVE_NUMBER'),
    ),
});
