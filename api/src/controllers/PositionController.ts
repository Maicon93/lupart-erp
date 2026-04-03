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

export default class PositionController {
    private positionService = new PositionService();

    async findAll(request: Request, response: Response): Promise<void> {
        try {
            const { search, page = '1', limit = '20' } = request.query;
            const result = await this.positionService.findAll(
                search as string,
                Number(page),
                Number(limit),
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
    }

    async findById(request: Request, response: Response): Promise<void> {
        try {
            const id = Number(request.params.id);
            const position = await this.positionService.findById(id);

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
    }

    async create(request: Request, response: Response): Promise<void> {
        try {
            const userId = getUserId(request);
            const position = await this.positionService.create(request.body, userId);

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
    }

    async update(request: Request, response: Response): Promise<void> {
        try {
            const id = Number(request.params.id);
            const userId = getUserId(request);
            const position = await this.positionService.update(id, request.body, userId);

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
    }

    async remove(request: Request, response: Response): Promise<void> {
        try {
            const id = Number(request.params.id);
            await this.positionService.remove(id);

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
    }
}
