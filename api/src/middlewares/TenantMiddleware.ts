import { Response, NextFunction } from 'express';
import { IAuthRequest } from '../interfaces/IAuthRequest';
import { AppDataSource } from '../config/database';
import { User } from '../models/User';
import messageCodes from '../i18n/MessageCodes';
import { IApiResponse } from '../interfaces/IApiResponse';

export async function tenantMiddleware(request: IAuthRequest, response: Response, next: NextFunction) {
    try {
        const user = await AppDataSource.getRepository(User).findOne({
            where: { id: request.userId },
            select: ['id', 'companyId'],
        });

        if (!user || !user.companyId) {
            const apiResponse: IApiResponse = {
                type: 'error',
                messageCode: messageCodes.common.messages.COMPANY_REQUIRED,
            };
            return response.status(400).json(apiResponse);
        }

        request.companyId = user.companyId;
        return next();
    } catch {
        const apiResponse: IApiResponse = {
            type: 'error',
            messageCode: messageCodes.common.messages.ERROR,
        };
        return response.status(500).json(apiResponse);
    }
}
