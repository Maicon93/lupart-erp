import { Request, Response } from 'express';
import SystemConfigurationService from '../services/SystemConfigurationService';
import messageCodes from '../i18n/MessageCodes';
import logger from '../helpers/Logger';
import { IApiResponse } from '../interfaces/IApiResponse';

export default class SystemConfigurationController {
    private systemConfigurationService = new SystemConfigurationService();

    async findAll(_request: Request, response: Response): Promise<void> {
        try {
            const configurations = await this.systemConfigurationService.findAll();
            const apiResponse: IApiResponse = { type: 'success', data: configurations };
            response.status(200).json(apiResponse);
        } catch (error: unknown) {
            logger.error('Failed to list system configurations', { error });
            const apiResponse: IApiResponse = { type: 'error', messageCode: messageCodes.common.messages.ERROR };
            response.status(500).json(apiResponse);
        }
    }

    async updateSection(request: Request, response: Response): Promise<void> {
        try {
            await this.systemConfigurationService.updateSection(request.body);
            const apiResponse: IApiResponse = { type: 'success', messageCode: messageCodes.common.messages.UPDATED };
            response.status(200).json(apiResponse);
        } catch (error: unknown) {
            const typedError = error as { status?: number; messageCode?: string };

            if (typedError.messageCode) {
                const apiResponse: IApiResponse = { type: 'error', messageCode: typedError.messageCode };
                response.status(typedError.status || 400).json(apiResponse);
                return;
            }

            logger.error('Failed to update system configurations', { error });
            const apiResponse: IApiResponse = { type: 'error', messageCode: messageCodes.common.messages.ERROR };
            response.status(500).json(apiResponse);
        }
    }
}
