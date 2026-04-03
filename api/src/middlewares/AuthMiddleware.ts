import { Response, NextFunction } from 'express';
import { IAuthRequest } from '../interfaces/IAuthRequest';
import { verifyAccessToken } from '../helpers/JWTUtil';
import messageCodes from '../i18n/MessageCodes';
import { IApiResponse } from '../interfaces/IApiResponse';

const PUBLIC_PATHS = ['/api/auth/login', '/api/auth/refresh-token', '/api/health'];

export function authMiddleware(request: IAuthRequest, response: Response, next: NextFunction) {
    if (PUBLIC_PATHS.includes(request.path)) {
        return next();
    }

    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        const apiResponse: IApiResponse = {
            type: 'error',
            messageCode: messageCodes.common.messages.UNAUTHORIZED,
        };
        return response.status(401).json(apiResponse);
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = verifyAccessToken(token);
        request.userId = decoded.userId;
        request.userRole = decoded.role;
        return next();
    } catch {
        const apiResponse: IApiResponse = {
            type: 'error',
            messageCode: messageCodes.common.messages.UNAUTHORIZED,
        };
        return response.status(401).json(apiResponse);
    }
}
