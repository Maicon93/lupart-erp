import { Request, Response } from 'express';
import UserService from '../services/UserService';
import messageCodes from '../i18n/MessageCodes';
import logger from '../helpers/Logger';
import { IApiResponse } from '../interfaces/IApiResponse';

export default class UserController {
    private userService = new UserService();

    async findAll(request: Request, response: Response): Promise<void> {
        try {
            const { search, status, page = '1', limit = '20' } = request.query;
            const result = await this.userService.findAll(search as string, status as string, Number(page), Number(limit));

            const apiResponse: IApiResponse = { type: 'success', data: result };
            response.status(200).json(apiResponse);
        } catch (error: unknown) {
            logger.error('Failed to list users', { error });
            response.status(500).json({ type: 'error', messageCode: messageCodes.common.messages.ERROR });
        }
    }

    async findById(request: Request, response: Response): Promise<void> {
        try {
            const id = Number(request.params.id);
            const user = await this.userService.findByIdWithProfile(id);

            const apiResponse: IApiResponse = { type: 'success', data: user };
            response.status(200).json(apiResponse);
        } catch (error: unknown) {
            const typedError = error as { status?: number; messageCode?: string };

            if (typedError.messageCode) {
                response.status(typedError.status || 400).json({ type: 'error', messageCode: typedError.messageCode });
                return;
            }

            logger.error('Failed to find user', { error });
            response.status(500).json({ type: 'error', messageCode: messageCodes.common.messages.ERROR });
        }
    }

    async create(request: Request, response: Response): Promise<void> {
        try {
            // TODO: get from JWT middleware
            const currentUserId = 1;
            const user = await this.userService.create(request.body, currentUserId);

            const apiResponse: IApiResponse = { type: 'success', messageCode: messageCodes.common.messages.CREATED, data: user };
            response.status(201).json(apiResponse);
        } catch (error: unknown) {
            const typedError = error as { status?: number; messageCode?: string };

            if (typedError.messageCode) {
                response.status(typedError.status || 400).json({ type: 'error', messageCode: typedError.messageCode });
                return;
            }

            logger.error('Failed to create user', { error });
            response.status(500).json({ type: 'error', messageCode: messageCodes.common.messages.ERROR });
        }
    }

    async update(request: Request, response: Response): Promise<void> {
        try {
            const id = Number(request.params.id);
            // TODO: get from JWT middleware
            const currentUserId = 1;
            const user = await this.userService.update(id, request.body, currentUserId);

            const apiResponse: IApiResponse = { type: 'success', messageCode: messageCodes.common.messages.UPDATED, data: user };
            response.status(200).json(apiResponse);
        } catch (error: unknown) {
            const typedError = error as { status?: number; messageCode?: string };

            if (typedError.messageCode) {
                response.status(typedError.status || 400).json({ type: 'error', messageCode: typedError.messageCode });
                return;
            }

            logger.error('Failed to update user', { error });
            response.status(500).json({ type: 'error', messageCode: messageCodes.common.messages.ERROR });
        }
    }

    async toggleStatus(request: Request, response: Response): Promise<void> {
        try {
            const id = Number(request.params.id);
            const user = await this.userService.toggleStatus(id);

            const apiResponse: IApiResponse = { type: 'success', messageCode: messageCodes.common.messages.UPDATED, data: user };
            response.status(200).json(apiResponse);
        } catch (error: unknown) {
            const typedError = error as { status?: number; messageCode?: string };

            if (typedError.messageCode) {
                response.status(typedError.status || 400).json({ type: 'error', messageCode: typedError.messageCode });
                return;
            }

            logger.error('Failed to toggle user status', { error });
            response.status(500).json({ type: 'error', messageCode: messageCodes.common.messages.ERROR });
        }
    }

    async findAllActive(_request: Request, response: Response): Promise<void> {
        try {
            const users = await this.userService.findAllActive();

            const apiResponse: IApiResponse = { type: 'success', data: users };
            response.status(200).json(apiResponse);
        } catch (error: unknown) {
            logger.error('Failed to list active users', { error });
            response.status(500).json({ type: 'error', messageCode: messageCodes.common.messages.ERROR });
        }
    }

    async findGlobalRoles(_request: Request, response: Response): Promise<void> {
        try {
            const roles = await this.userService.findGlobalRoles();

            const apiResponse: IApiResponse = { type: 'success', data: roles };
            response.status(200).json(apiResponse);
        } catch (error: unknown) {
            logger.error('Failed to list global roles', { error });
            response.status(500).json({ type: 'error', messageCode: messageCodes.common.messages.ERROR });
        }
    }
}
