import { z } from 'zod';

const isValidCnpj = (cnpj) => {
    const digits = cnpj.replace(/\D/g, '');

    if (digits.length !== 14) return false;
    if (/^(\d)\1{13}$/.test(digits)) return false;

    const weights1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    const weights2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];

    let sum = 0;
    for (let i = 0; i < 12; i++) {
        sum += parseInt(digits[i]) * weights1[i];
    }
    let remainder = sum % 11;
    const firstDigit = remainder < 2 ? 0 : 11 - remainder;

    if (parseInt(digits[12]) !== firstDigit) return false;

    sum = 0;
    for (let i = 0; i < 13; i++) {
        sum += parseInt(digits[i]) * weights2[i];
    }
    remainder = sum % 11;
    const secondDigit = remainder < 2 ? 0 : 11 - remainder;

    return parseInt(digits[13]) === secondDigit;
};

export const companySchema = z.object({
    name: z.string().nonempty('common.validations.REQUIRED_FIELD').max(255),
    cnpj: z.string().nonempty('common.validations.REQUIRED_FIELD').refine(isValidCnpj, { message: 'companies.validations.INVALID_CNPJ' }),
    phone: z.string().optional().or(z.literal('')),
    email: z.string().email('common.validations.INVALID_EMAIL').optional().or(z.literal('')),
    zipCode: z.string().optional().or(z.literal('')),
    street: z.string().nonempty('common.validations.REQUIRED_FIELD'),
    number: z.string().nonempty('common.validations.REQUIRED_FIELD'),
    complement: z.string().nonempty('common.validations.REQUIRED_FIELD'),
    neighborhood: z.string().nonempty('common.validations.REQUIRED_FIELD'),
    city: z.string().optional().or(z.literal('')),
    state: z.string().optional().or(z.literal('')),
    accessPlanId: z.preprocess((val) => (val === null || val === '' ? undefined : val), z.number({ required_error: 'common.validations.REQUIRED_FIELD', invalid_type_error: 'common.validations.REQUIRED_FIELD' }).int().positive()),
    responsibleId: z.preprocess((val) => (val === null || val === '' ? undefined : val), z.number({ required_error: 'common.validations.REQUIRED_FIELD', invalid_type_error: 'common.validations.REQUIRED_FIELD' }).int().positive()),
    matriz: z.number().int().positive().nullable().optional(),
});
