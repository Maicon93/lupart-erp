import { Request, Response } from 'express';
import AccessPlanService from '../services/AccessPlanService';
import messageCodes from '../i18n/MessageCodes';
import logger from '../helpers/Logger';
import { IApiResponse } from '../interfaces/IApiResponse';

const findAll = async (request: Request, response: Response): Promise<void> => {
    try {
        const { status, page = '1', limit = '20' } = request.query;
        const result = await AccessPlanService.findAll(status as string, parseInt(page as string), parseInt(limit as string));

        const apiResponse: IApiResponse = {
            type: 'success',
            data: result,
        };

        response.status(200).json(apiResponse);
    } catch (error: unknown) {
        logger.error('Failed to list access plans', { error });
        response.status(500).json({ type: 'error', messageCode: messageCodes.common.messages.ERROR });
    }
};

const findById = async (request: Request, response: Response): Promise<void> => {
    try {
        const { id } = request.params;
        const accessPlan = await AccessPlanService.findById(parseInt(id));

        const apiResponse: IApiResponse = {
            type: 'success',
            data: accessPlan,
        };

        response.status(200).json(apiResponse);
    } catch (error: unknown) {
        const typedError = error as { status?: number; messageCode?: string };

        if (typedError.messageCode) {
            response.status(typedError.status || 400).json({ type: 'error', messageCode: typedError.messageCode });
            return;
        }

        logger.error('Failed to find access plan', { error });
        response.status(500).json({ type: 'error', messageCode: messageCodes.common.messages.ERROR });
    }
};

const create = async (request: Request, response: Response): Promise<void> => {
    try {
        const accessPlan = await AccessPlanService.create(request.body);

        const apiResponse: IApiResponse = {
            type: 'success',
            messageCode: messageCodes.common.messages.CREATED,
            data: accessPlan,
        };

        response.status(201).json(apiResponse);
    } catch (error: unknown) {
        logger.error('Failed to create access plan', { error });
        response.status(500).json({ type: 'error', messageCode: messageCodes.common.messages.ERROR });
    }
};

const update = async (request: Request, response: Response): Promise<void> => {
    try {
        const { id } = request.params;
        const accessPlan = await AccessPlanService.update(parseInt(id), request.body);

        const apiResponse: IApiResponse = {
            type: 'success',
            messageCode: messageCodes.common.messages.UPDATED,
            data: accessPlan,
        };

        response.status(200).json(apiResponse);
    } catch (error: unknown) {
        const typedError = error as { status?: number; messageCode?: string };

        if (typedError.messageCode) {
            response.status(typedError.status || 400).json({ type: 'error', messageCode: typedError.messageCode });
            return;
        }

        logger.error('Failed to update access plan', { error });
        response.status(500).json({ type: 'error', messageCode: messageCodes.common.messages.ERROR });
    }
};

const toggleStatus = async (request: Request, response: Response): Promise<void> => {
    try {
        const { id } = request.params;
        const accessPlan = await AccessPlanService.toggleStatus(parseInt(id));

        const apiResponse: IApiResponse = {
            type: 'success',
            messageCode: messageCodes.common.messages.UPDATED,
            data: accessPlan,
        };

        response.status(200).json(apiResponse);
    } catch (error: unknown) {
        const typedError = error as { status?: number; messageCode?: string };

        if (typedError.messageCode) {
            response.status(typedError.status || 400).json({ type: 'error', messageCode: typedError.messageCode });
            return;
        }

        logger.error('Failed to toggle access plan status', { error });
        response.status(500).json({ type: 'error', messageCode: messageCodes.common.messages.ERROR });
    }
};

const remove = async (request: Request, response: Response): Promise<void> => {
    try {
        const { id } = request.params;
        await AccessPlanService.remove(parseInt(id));

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

        logger.error('Failed to delete access plan', { error });
        response.status(500).json({ type: 'error', messageCode: messageCodes.common.messages.ERROR });
    }
};

export default { findAll, findById, create, update, toggleStatus, remove };
