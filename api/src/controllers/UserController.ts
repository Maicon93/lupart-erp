import { Request, Response } from 'express';
import UserService from '../services/UserService';
import messageCodes from '../i18n/MessageCodes';
import logger from '../helpers/Logger';
import { IApiResponse } from '../interfaces/IApiResponse';

const findAll = async (request: Request, response: Response): Promise<void> => {
    try {
        const { search, status, page = '1', limit = '20' } = request.query;
        const result = await UserService.findAll(search as string, status as string, parseInt(page as string), parseInt(limit as string));

        const apiResponse: IApiResponse = {
            type: 'success',
            data: result,
        };

        response.status(200).json(apiResponse);
    } catch (error: unknown) {
        logger.error('Failed to list users', { error });
        response.status(500).json({ type: 'error', messageCode: messageCodes.common.messages.ERROR });
    }
};

const findById = async (request: Request, response: Response): Promise<void> => {
    try {
        const { id } = request.params;
        const user = await UserService.findByIdWithProfile(parseInt(id));

        const apiResponse: IApiResponse = {
            type: 'success',
            data: user,
        };

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
};

const create = async (request: Request, response: Response): Promise<void> => {
    try {
        // TODO: get from JWT middleware
        const currentUserId = 1;
        const user = await UserService.create(request.body, currentUserId);

        const apiResponse: IApiResponse = {
            type: 'success',
            messageCode: messageCodes.common.messages.CREATED,
            data: user,
        };

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
};

const update = async (request: Request, response: Response): Promise<void> => {
    try {
        const { id } = request.params;
        // TODO: get from JWT middleware
        const currentUserId = 1;
        const user = await UserService.update(parseInt(id), request.body, currentUserId);

        const apiResponse: IApiResponse = {
            type: 'success',
            messageCode: messageCodes.common.messages.UPDATED,
            data: user,
        };

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
};

const toggleStatus = async (request: Request, response: Response): Promise<void> => {
    try {
        const { id } = request.params;
        const user = await UserService.toggleStatus(parseInt(id));

        const apiResponse: IApiResponse = {
            type: 'success',
            messageCode: messageCodes.common.messages.UPDATED,
            data: user,
        };

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
};

const findAllActive = async (_request: Request, response: Response): Promise<void> => {
    try {
        const users = await UserService.findAllActive();

        const apiResponse: IApiResponse = {
            type: 'success',
            data: users,
        };

        response.status(200).json(apiResponse);
    } catch (error: unknown) {
        logger.error('Failed to list active users', { error });
        response.status(500).json({ type: 'error', messageCode: messageCodes.common.messages.ERROR });
    }
};

const findGlobalRoles = async (_request: Request, response: Response): Promise<void> => {
    try {
        const roles = await UserService.findGlobalRoles();

        const apiResponse: IApiResponse = {
            type: 'success',
            data: roles,
        };

        response.status(200).json(apiResponse);
    } catch (error: unknown) {
        logger.error('Failed to list global roles', { error });
        response.status(500).json({ type: 'error', messageCode: messageCodes.common.messages.ERROR });
    }
};

export default { findAll, findById, create, update, toggleStatus, findAllActive, findGlobalRoles };
