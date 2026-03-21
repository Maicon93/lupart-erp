import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';
import messageCodes from '../i18n/MessageCodes';

export const validate = (schema: ZodSchema) => {
    return (request: Request, response: Response, next: NextFunction): void => {
        const result = schema.safeParse(request.body);

        if (!result.success) {
            response.status(400).json({
                type: 'error',
                messageCode: messageCodes.common.validations.VALIDATION_ERROR,
                data: result.error.flatten().fieldErrors,
            });
            return;
        }

        request.body = result.data;
        next();
    };
};
