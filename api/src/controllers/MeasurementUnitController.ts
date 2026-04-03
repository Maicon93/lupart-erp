import { Response } from 'express';
import { IAuthRequest } from '../interfaces/IAuthRequest';
import MeasurementUnitService from '../services/MeasurementUnitService';
import messageCodes from '../i18n/MessageCodes';
import logger from '../helpers/Logger';
import { IApiResponse } from '../interfaces/IApiResponse';

export default class MeasurementUnitController {
    private measurementUnitService = new MeasurementUnitService();

    async findAll(request: IAuthRequest, response: Response): Promise<void> {
        try {
            const { search, status, page = '1', limit = '20' } = request.query;
            const result = await this.measurementUnitService.findAll(
                request.companyId!,
                search as string,
                status as string,
                Number(page),
                Number(limit)
            );

            const apiResponse: IApiResponse = { type: 'success', data: result };
            response.status(200).json(apiResponse);
        } catch (error: unknown) {
            logger.error('Failed to list measurement units', { error });
            const apiResponse: IApiResponse = { type: 'error', messageCode: messageCodes.common.messages.ERROR };
            response.status(500).json(apiResponse);
        }
    }

    async findById(request: IAuthRequest, response: Response): Promise<void> {
        try {
            const id = Number(request.params.id);
            const unit = await this.measurementUnitService.findById(id, request.companyId!);

            const apiResponse: IApiResponse = { type: 'success', data: unit };
            response.status(200).json(apiResponse);
        } catch (error: unknown) {
            const typedError = error as { status?: number; messageCode?: string };

            if (typedError.messageCode) {
                response.status(typedError.status || 400).json({ type: 'error', messageCode: typedError.messageCode });
                return;
            }

            logger.error('Failed to find measurement unit', { error });
            response.status(500).json({ type: 'error', messageCode: messageCodes.common.messages.ERROR });
        }
    }

    async create(request: IAuthRequest, response: Response): Promise<void> {
        try {
            const unit = await this.measurementUnitService.create(request.companyId!, request.body);

            const apiResponse: IApiResponse = { type: 'success', messageCode: messageCodes.common.messages.CREATED, data: unit };
            response.status(201).json(apiResponse);
        } catch (error: unknown) {
            const typedError = error as { status?: number; messageCode?: string };

            if (typedError.messageCode) {
                response.status(typedError.status || 400).json({ type: 'error', messageCode: typedError.messageCode });
                return;
            }

            logger.error('Failed to create measurement unit', { error });
            response.status(500).json({ type: 'error', messageCode: messageCodes.common.messages.ERROR });
        }
    }

    async update(request: IAuthRequest, response: Response): Promise<void> {
        try {
            const id = Number(request.params.id);
            const unit = await this.measurementUnitService.update(id, request.companyId!, request.body);

            const apiResponse: IApiResponse = { type: 'success', messageCode: messageCodes.common.messages.UPDATED, data: unit };
            response.status(200).json(apiResponse);
        } catch (error: unknown) {
            const typedError = error as { status?: number; messageCode?: string };

            if (typedError.messageCode) {
                response.status(typedError.status || 400).json({ type: 'error', messageCode: typedError.messageCode });
                return;
            }

            logger.error('Failed to update measurement unit', { error });
            response.status(500).json({ type: 'error', messageCode: messageCodes.common.messages.ERROR });
        }
    }

    async toggleStatus(request: IAuthRequest, response: Response): Promise<void> {
        try {
            const id = Number(request.params.id);
            const unit = await this.measurementUnitService.toggleStatus(id, request.companyId!);

            const apiResponse: IApiResponse = { type: 'success', messageCode: messageCodes.common.messages.UPDATED, data: unit };
            response.status(200).json(apiResponse);
        } catch (error: unknown) {
            const typedError = error as { status?: number; messageCode?: string };

            if (typedError.messageCode) {
                response.status(typedError.status || 400).json({ type: 'error', messageCode: typedError.messageCode });
                return;
            }

            logger.error('Failed to toggle measurement unit status', { error });
            response.status(500).json({ type: 'error', messageCode: messageCodes.common.messages.ERROR });
        }
    }
}
