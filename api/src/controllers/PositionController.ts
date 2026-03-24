import { Request, Response } from 'express';
import PositionService from '../services/PositionService';
import messageCodes from '../i18n/MessageCodes';
import logger from '../helpers/Logger';
import JWTUtil from '../helpers/JWTUtil';
import { IApiResponse } from '../interfaces/IApiResponse';

const getUserId = (request: Request): number => {
    const token = request.headers.authorization?.replace('Bearer ', '') || '';
    const payload = JWTUtil.verifyAccessToken(token);
    return payload.userId;
};

const findAll = async (request: Request, response: Response): Promise<void> => {
    try {
        const { search, page = '1', limit = '20' } = request.query;
        const result = await PositionService.findAll(
            search as string,
            parseInt(page as string),
            parseInt(limit as string),
        );

        const apiResponse: IApiResponse = {
            type: 'success',
            data: result,
        };

        response.status(200).json(apiResponse);
    } catch (error: unknown) {
        logger.error('Failed to list positions', { error });
        response.status(500).json({ type: 'error', messageCode: messageCodes.common.messages.ERROR });
    }
};

const findById = async (request: Request, response: Response): Promise<void> => {
    try {
        const { id } = request.params;
        const position = await PositionService.findById(parseInt(id));

        const apiResponse: IApiResponse = {
            type: 'success',
            data: position,
        };

        response.status(200).json(apiResponse);
    } catch (error: unknown) {
        const typedError = error as { status?: number; messageCode?: string };

        if (typedError.messageCode) {
            response.status(typedError.status || 400).json({ type: 'error', messageCode: typedError.messageCode });
            return;
        }

        logger.error('Failed to find position', { error });
        response.status(500).json({ type: 'error', messageCode: messageCodes.common.messages.ERROR });
    }
};

const create = async (request: Request, response: Response): Promise<void> => {
    try {
        const userId = getUserId(request);
        const position = await PositionService.create(request.body, userId);

        const apiResponse: IApiResponse = {
            type: 'success',
            messageCode: messageCodes.common.messages.CREATED,
            data: position,
        };

        response.status(201).json(apiResponse);
    } catch (error: unknown) {
        const typedError = error as { status?: number; messageCode?: string };

        if (typedError.messageCode) {
            response.status(typedError.status || 400).json({ type: 'error', messageCode: typedError.messageCode });
            return;
        }

        logger.error('Failed to create position', { error });
        response.status(500).json({ type: 'error', messageCode: messageCodes.common.messages.ERROR });
    }
};

const update = async (request: Request, response: Response): Promise<void> => {
    try {
        const { id } = request.params;
        const userId = getUserId(request);
        const position = await PositionService.update(parseInt(id), request.body, userId);

        const apiResponse: IApiResponse = {
            type: 'success',
            messageCode: messageCodes.common.messages.UPDATED,
            data: position,
        };

        response.status(200).json(apiResponse);
    } catch (error: unknown) {
        const typedError = error as { status?: number; messageCode?: string };

        if (typedError.messageCode) {
            response.status(typedError.status || 400).json({ type: 'error', messageCode: typedError.messageCode });
            return;
        }

        logger.error('Failed to update position', { error });
        response.status(500).json({ type: 'error', messageCode: messageCodes.common.messages.ERROR });
    }
};

const remove = async (request: Request, response: Response): Promise<void> => {
    try {
        const { id } = request.params;
        await PositionService.remove(parseInt(id));

        const apiResponse: IApiResponse = {
            type: 'success',
            messageCode: messageCodes.common.messages.DELETED,
        };

        response.status(200).json(apiResponse);
    } catch (error: unknown) {
        const typedError = error as { status?: number; messageCode?: string };

        if (typedError.messageCode) {
            response.status(typedError.status || 400).json({ type: 'error', messageCode: typedError.messageCode });
            return;
        }

        logger.error('Failed to delete position', { error });
        response.status(500).json({ type: 'error', messageCode: messageCodes.common.messages.ERROR });
    }
};

export default { findAll, findById, create, update, remove };
