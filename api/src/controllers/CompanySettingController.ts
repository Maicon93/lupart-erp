import { Response } from 'express';
import { IAuthRequest } from '../interfaces/IAuthRequest';
import CompanySettingService from '../services/CompanySettingService';
import messageCodes from '../i18n/MessageCodes';
import logger from '../helpers/Logger';
import { IApiResponse } from '../interfaces/IApiResponse';

export default class CompanySettingController {
    private companySettingService = new CompanySettingService();

    async findByCompanyId(request: IAuthRequest, response: Response): Promise<void> {
        try {
            const setting = await this.companySettingService.findByCompanyId(request.companyId!);

            const apiResponse: IApiResponse = { type: 'success', data: setting };
            response.status(200).json(apiResponse);
        } catch (error: unknown) {
            const typedError = error as { status?: number; messageCode?: string };

            if (typedError.messageCode) {
                response.status(typedError.status || 400).json({ type: 'error', messageCode: typedError.messageCode });
                return;
            }

            logger.error('Failed to get company settings', { error });
            const apiResponse: IApiResponse = { type: 'error', messageCode: messageCodes.common.messages.ERROR };
            response.status(500).json(apiResponse);
        }
    }

    async updateSettings(request: IAuthRequest, response: Response): Promise<void> {
        try {
            const { allowNegativeStock } = request.body;
            await this.companySettingService.updateSettings(request.companyId!, allowNegativeStock);

            const apiResponse: IApiResponse = { type: 'success', messageCode: messageCodes.common.messages.UPDATED };
            response.status(200).json(apiResponse);
        } catch (error: unknown) {
            const typedError = error as { status?: number; messageCode?: string };

            if (typedError.messageCode) {
                response.status(typedError.status || 400).json({ type: 'error', messageCode: typedError.messageCode });
                return;
            }

            logger.error('Failed to update company settings', { error });
            const apiResponse: IApiResponse = { type: 'error', messageCode: messageCodes.common.messages.ERROR };
            response.status(500).json(apiResponse);
        }
    }

    async uploadLogo(request: IAuthRequest, response: Response): Promise<void> {
        try {
            if (!request.file) {
                response.status(400).json({ type: 'error', messageCode: messageCodes.companySettings.errors.LOGO_REQUIRED });
                return;
            }

            const logoUrl = await this.companySettingService.uploadLogo(
                request.companyId!,
                request.file.buffer,
                request.file.mimetype,
            );

            const apiResponse: IApiResponse = { type: 'success', messageCode: messageCodes.common.messages.UPDATED, data: { logoUrl } };
            response.status(200).json(apiResponse);
        } catch (error: unknown) {
            const typedError = error as { status?: number; messageCode?: string };

            if (typedError.messageCode) {
                response.status(typedError.status || 400).json({ type: 'error', messageCode: typedError.messageCode });
                return;
            }

            logger.error('Failed to upload company logo', { error });
            const apiResponse: IApiResponse = { type: 'error', messageCode: messageCodes.common.messages.ERROR };
            response.status(500).json(apiResponse);
        }
    }

    async removeLogo(request: IAuthRequest, response: Response): Promise<void> {
        try {
            await this.companySettingService.removeLogo(request.companyId!);

            const apiResponse: IApiResponse = { type: 'success', messageCode: messageCodes.common.messages.UPDATED };
            response.status(200).json(apiResponse);
        } catch (error: unknown) {
            const typedError = error as { status?: number; messageCode?: string };

            if (typedError.messageCode) {
                response.status(typedError.status || 400).json({ type: 'error', messageCode: typedError.messageCode });
                return;
            }

            logger.error('Failed to remove company logo', { error });
            const apiResponse: IApiResponse = { type: 'error', messageCode: messageCodes.common.messages.ERROR };
            response.status(500).json(apiResponse);
        }
    }
}
