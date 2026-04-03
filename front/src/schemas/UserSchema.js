import { z } from 'zod';

export const createUserSchema = z
    .object({
        name: z.string().nonempty('common.validations.REQUIRED_FIELD'),
        email: z.string().nonempty('common.validations.REQUIRED_FIELD').email('common.validations.INVALID_EMAIL'),
        password: z.string().min(6, 'users.validations.PASSWORD_MIN_LENGTH'),
        confirmPassword: z.string().min(6, 'users.validations.PASSWORD_MIN_LENGTH'),
        phone: z.string().nonempty('common.validations.REQUIRED_FIELD'),
        country: z.string().nonempty('common.validations.REQUIRED_FIELD'),
        language: z.string().nonempty('common.validations.REQUIRED_FIELD'),
        roleId: z.preprocess((val) => (val === null || val === '' ? undefined : val), z.number({ required_error: 'common.validations.REQUIRED_FIELD', invalid_type_error: 'common.validations.REQUIRED_FIELD' }).int().positive()),
        companyId: z.preprocess((val) => (val === null || val === '' ? undefined : val), z.number({ required_error: 'common.validations.REQUIRED_FIELD', invalid_type_error: 'common.validations.REQUIRED_FIELD' }).int().positive()),
    })
    .refine((data) => data.password === data.confirmPassword, {
        path: ['confirmPassword'],
        message: 'users.validations.PASSWORDS_DONT_MATCH',
    });

export const updateUserSchema = z
    .object({
        name: z.string().nonempty('common.validations.REQUIRED_FIELD'),
        email: z.string().nonempty('common.validations.REQUIRED_FIELD').email('common.validations.INVALID_EMAIL'),
        password: z
            .string()
            .min(6, 'users.validations.PASSWORD_MIN_LENGTH')
            .optional()
            .or(z.literal('')),
        confirmPassword: z.string().optional().or(z.literal('')),
        phone: z.string().nonempty('common.validations.REQUIRED_FIELD'),
        country: z.string().nonempty('common.validations.REQUIRED_FIELD'),
        language: z.string().nonempty('common.validations.REQUIRED_FIELD'),
        roleId: z.preprocess((val) => (val === null || val === '' ? undefined : val), z.number({ required_error: 'common.validations.REQUIRED_FIELD', invalid_type_error: 'common.validations.REQUIRED_FIELD' }).int().positive()),
        companyId: z.preprocess((val) => (val === null || val === '' ? undefined : val), z.number({ required_error: 'common.validations.REQUIRED_FIELD', invalid_type_error: 'common.validations.REQUIRED_FIELD' }).int().positive()),
    })
    .refine(
        (data) => {
            if (data.password && data.password !== '') {
                return data.password === data.confirmPassword;
            }
            return true;
        },
        {
            path: ['confirmPassword'],
            message: 'users.validations.PASSWORDS_DONT_MATCH',
        },
    );
