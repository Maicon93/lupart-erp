import { z } from 'zod';
import { cpf, cnpj } from 'cpf-cnpj-validator';

const isValidCpfCnpj = (value) => {
    const digits = value.replace(/\D/g, '');
    if (digits.length <= 11) return cpf.isValid(digits);
    return cnpj.isValid(digits);
};

export const supplierSchema = z.object({
    name: z.string().min(1, 'common.validations.REQUIRED_FIELD').max(255),
    cpfCnpj: z.string().min(1, 'common.validations.REQUIRED_FIELD').refine(isValidCpfCnpj, { message: 'suppliers.validations.INVALID_CPF_CNPJ' }),
    phone: z.string().min(1, 'common.validations.REQUIRED_FIELD'),
    email: z.string().email('common.validations.INVALID_EMAIL').optional().or(z.literal('')),
    zipCode: z.string().optional().or(z.literal('')),
    street: z.string().optional().or(z.literal('')),
    number: z.string().optional().or(z.literal('')),
    complement: z.string().optional().or(z.literal('')),
    neighborhood: z.string().optional().or(z.literal('')),
    city: z.string().optional().or(z.literal('')),
    state: z.string().optional().or(z.literal('')),
    notes: z.string().optional().or(z.literal('')),
});
