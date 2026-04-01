import { z } from 'zod';
import { cpf, cnpj } from 'cpf-cnpj-validator';

const isValidCpfCnpj = (value: string): boolean => {
    const digits = value.replace(/\D/g, '');
    if (digits.length <= 11) return cpf.isValid(digits);
    return cnpj.isValid(digits);
};

export const createCustomerSchema = z.object({
    name: z.string().trim().min(1).max(255),
    cpfCnpj: z.string().trim().min(1).refine(isValidCpfCnpj),
    phone: z.string().trim().min(1),
    email: z.string().trim().email().optional().or(z.literal('')),
    zipCode: z.string().trim().optional().or(z.literal('')),
    street: z.string().trim().optional().or(z.literal('')),
    number: z.string().trim().optional().or(z.literal('')),
    complement: z.string().trim().optional().or(z.literal('')),
    neighborhood: z.string().trim().optional().or(z.literal('')),
    city: z.string().trim().optional().or(z.literal('')),
    state: z.string().trim().optional().or(z.literal('')),
    notes: z.string().trim().optional().or(z.literal('')),
});

export const updateCustomerSchema = createCustomerSchema;
