import { z } from 'zod';

export const tokensSchema = z.object({
    access_token_duration: z
        .number({ invalid_type_error: 'common.validations.REQUIRED_FIELD' })
        .int()
        .positive('systemParameters.validations.POSITIVE_NUMBER'),
    refresh_token_duration: z
        .number({ invalid_type_error: 'common.validations.REQUIRED_FIELD' })
        .int()
        .positive('systemParameters.validations.POSITIVE_NUMBER'),
});

export const uploadSchema = z.object({
    max_upload_size: z
        .number({ invalid_type_error: 'common.validations.REQUIRED_FIELD' })
        .int()
        .positive('systemParameters.validations.POSITIVE_NUMBER'),
});
