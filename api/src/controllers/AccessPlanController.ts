import { Request, Response } from 'express';
import AccessPlanService from '../services/AccessPlanService';
import messageCodes from '../i18n/MessageCodes';
import logger from '../helpers/Logger';
import { IApiResponse } from '../interfaces/IApiResponse';

export default class AccessPlanController {
    private accessPlanService = new AccessPlanService();

    async findAll(request: Request, response: Response): Promise<void> {
        try {
            const { status, page = '1', limit = '20' } = request.query;
            const result = await this.accessPlanService.findAll(status as string, Number(page), Number(limit));

            const apiResponse: IApiResponse = { type: 'success', data: result };
            response.status(200).json(apiResponse);
        } catch (error: unknown) {
            logger.error('Failed to list access plans', { error });
            response.status(500).json({ type: 'error', messageCode: messageCodes.common.messages.ERROR });
        }
    }

    async findById(request: Request, response: Response): Promise<void> {
        try {
            const id = Number(request.params.id);
            const accessPlan = await this.accessPlanService.findById(id);

            const apiResponse: IApiResponse = { type: 'success', data: accessPlan };
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
    }

    async create(request: Request, response: Response): Promise<void> {
        try {
            const accessPlan = await this.accessPlanService.create(request.body);

            const apiResponse: IApiResponse = { type: 'success', messageCode: messageCodes.common.messages.CREATED, data: accessPlan };
            response.status(201).json(apiResponse);
        } catch (error: unknown) {
            logger.error('Failed to create access plan', { error });
            response.status(500).json({ type: 'error', messageCode: messageCodes.common.messages.ERROR });
        }
    }

    async update(request: Request, response: Response): Promise<void> {
        try {
            const id = Number(request.params.id);
            const accessPlan = await this.accessPlanService.update(id, request.body);

            const apiResponse: IApiResponse = { type: 'success', messageCode: messageCodes.common.messages.UPDATED, data: accessPlan };
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
    }

    async toggleStatus(request: Request, response: Response): Promise<void> {
        try {
            const id = Number(request.params.id);
            const accessPlan = await this.accessPlanService.toggleStatus(id);

            const apiResponse: IApiResponse = { type: 'success', messageCode: messageCodes.common.messages.UPDATED, data: accessPlan };
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
    }

    async remove(request: Request, response: Response): Promise<void> {
        try {
            const id = Number(request.params.id);
            await this.accessPlanService.remove(id);

            const apiResponse: IApiResponse = { type: 'success', messageCode: messageCodes.common.messages.DELETED };
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
    }
}
