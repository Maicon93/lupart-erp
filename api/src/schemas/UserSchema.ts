import { z } from 'zod';

export const createUserSchema = z
    .object({
        name: z.string().nonempty().max(255),
        email: z.string().email(),
        password: z.string().min(6),
        confirmPassword: z.string().min(6),
        phone: z.string().nonempty(),
        country: z.string().nonempty(),
        language: z.string().nonempty(),
        roleId: z.number().int().positive(),
        companyIds: z.array(z.number().int().positive()).optional().default([]),
    })
    .refine((data) => data.password === data.confirmPassword, {
        path: ['confirmPassword'],
        message: 'users.validations.PASSWORDS_DONT_MATCH',
    });

export const updateUserSchema = z
    .object({
        name: z.string().nonempty().max(255),
        email: z.string().email(),
        password: z.string().min(6).optional().or(z.literal('')),
        confirmPassword: z.string().optional().or(z.literal('')),
        phone: z.string().nonempty(),
        country: z.string().nonempty(),
        language: z.string().nonempty(),
        roleId: z.number().int().positive(),
        companyIds: z.array(z.number().int().positive()).optional().default([]),
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
        }
    );
