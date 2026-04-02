import { Request, Response } from 'express';
import permissionService from '../services/PermissionService';
import messageCodes from '../i18n/MessageCodes';
import logger from '../helpers/Logger';
import { IApiResponse } from '../interfaces/IApiResponse';
import { IAuthRequest } from '../interfaces/IAuthRequest';

const findAll = async (request: Request, response: Response) => {
    try {
        const { filter, page, limit } = request.query;

        const result = await permissionService.findAll(
            filter as string,
            page ? Number(page) : undefined,
            limit ? Number(limit) : undefined,
        );

        const apiResponse: IApiResponse = {
            type: 'success',
            data: result,
        };

        return response.status(200).json(apiResponse);
    } catch (error: unknown) {
        logger.error('Error fetching permissions', { error });

        const apiResponse: IApiResponse = {
            type: 'error',
            messageCode: messageCodes.common.messages.ERROR,
        };

        return response.status(500).json(apiResponse);
    }
};

const checkPermission = async (request: Request, response: Response) => {
    try {
        const { permission } = request.query;
        const { userId, userRole } = request as IAuthRequest & { userId: number; userRole: string };

        if (!permission) {
            const apiResponse: IApiResponse = {
                type: 'error',
                messageCode: messageCodes.common.validations.REQUIRED_FIELD,
            };
            return response.status(400).json(apiResponse);
        }

        const hasPermission = await permissionService.checkPermission(
            userId,
            userRole,
            permission as string,
        );

        const apiResponse: IApiResponse = {
            type: 'success',
            data: { hasPermission },
        };

        return response.status(200).json(apiResponse);
    } catch (error: unknown) {
        logger.error('Error checking permission', { error });

        const apiResponse: IApiResponse = {
            type: 'error',
            messageCode: messageCodes.common.messages.ERROR,
        };

        return response.status(500).json(apiResponse);
    }
};

export default { findAll, checkPermission };
