import { Response } from 'express';
import { IAuthRequest } from '../interfaces/IAuthRequest';
import StockEntryService from '../services/StockEntryService';
import messageCodes from '../i18n/MessageCodes';
import logger from '../helpers/Logger';
import { IApiResponse } from '../interfaces/IApiResponse';

export default class StockEntryController {
    private stockEntryService = new StockEntryService();

    async findAll(request: IAuthRequest, response: Response): Promise<void> {
        try {
            const { search, supplierId, dateStart, dateEnd, createdBy, page = '1', limit = '20' } = request.query;
            const result = await this.stockEntryService.findAll(
                request.companyId!,
                search as string,
                supplierId ? Number(supplierId) : undefined,
                dateStart as string,
                dateEnd as string,
                createdBy as string,
                Number(page),
                Number(limit)
            );

            const apiResponse: IApiResponse = { type: 'success', data: result };
            response.status(200).json(apiResponse);
        } catch (error: unknown) {
            logger.error('Failed to list stock entries', { error });
            const apiResponse: IApiResponse = { type: 'error', messageCode: messageCodes.common.messages.ERROR };
            response.status(500).json(apiResponse);
        }
    }

    async findById(request: IAuthRequest, response: Response): Promise<void> {
        try {
            const id = Number(request.params.id);
            const entry = await this.stockEntryService.findById(id, request.companyId!);

            const apiResponse: IApiResponse = { type: 'success', data: entry };
            response.status(200).json(apiResponse);
        } catch (error: unknown) {
            const typedError = error as { status?: number; messageCode?: string };

            if (typedError.messageCode) {
                response.status(typedError.status || 400).json({ type: 'error', messageCode: typedError.messageCode });
                return;
            }

            logger.error('Failed to find stock entry', { error });
            response.status(500).json({ type: 'error', messageCode: messageCodes.common.messages.ERROR });
        }
    }

    async create(request: IAuthRequest, response: Response): Promise<void> {
        try {
            const entry = await this.stockEntryService.create(request.companyId!, request.userId!, request.body);

            const apiResponse: IApiResponse = { type: 'success', messageCode: messageCodes.common.messages.CREATED, data: entry };
            response.status(201).json(apiResponse);
        } catch (error: unknown) {
            const typedError = error as { status?: number; messageCode?: string };

            if (typedError.messageCode) {
                response.status(typedError.status || 400).json({ type: 'error', messageCode: typedError.messageCode });
                return;
            }

            logger.error('Failed to create stock entry', { error });
            response.status(500).json({ type: 'error', messageCode: messageCodes.common.messages.ERROR });
        }
    }
}
