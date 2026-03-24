import { z } from 'zod';

const isValidCnpj = (cnpj: string): boolean => {
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

export const createCompanySchema = z.object({
    name: z.string().nonempty().max(255),
    cnpj: z.string().nonempty().refine(isValidCnpj, { message: 'companies.validations.INVALID_CNPJ' }),
    phone: z.string().optional(),
    email: z.union([z.string().email(), z.literal('')]).optional(),
    zipCode: z.string().optional(),
    street: z.string().nonempty(),
    number: z.string().nonempty(),
    complement: z.string().nonempty(),
    neighborhood: z.string().nonempty(),
    city: z.string().optional(),
    state: z.string().optional(),
    accessPlanId: z.number().int().positive(),
    responsibleId: z.number().int().positive(),
    matriz: z.number().int().positive().optional().nullable(),
});

export const updateCompanySchema = createCompanySchema;
