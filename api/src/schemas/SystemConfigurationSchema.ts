import { z } from 'zod';

export const updateTokensSchema = z.object({
    access_token_duration: z.number().int().positive(),
    refresh_token_duration: z.number().int().positive(),
});

export const updateUploadSchema = z.object({
    max_upload_size: z.number().int().positive(),
});
