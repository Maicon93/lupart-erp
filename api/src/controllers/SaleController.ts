import { Response } from 'express';
import { IAuthRequest } from '../interfaces/IAuthRequest';
import SaleService from '../services/SaleService';
import messageCodes from '../i18n/MessageCodes';
import logger from '../helpers/Logger';
import { IApiResponse } from '../interfaces/IApiResponse';

export default class SaleController {
    private saleService = new SaleService();

    async findAll(request: IAuthRequest, response: Response): Promise<void> {
        try {
            const { search, customerId, dateStart, dateEnd, page = '1', limit = '20' } = request.query;

            const result = await this.saleService.findAll(
                request.companyId!,
                search as string,
                customerId ? Number(customerId) : undefined,
                dateStart as string,
                dateEnd as string,
                Number(page),
                Number(limit)
            );

            const apiResponse: IApiResponse = { type: 'success', data: result };
            response.status(200).json(apiResponse);
        } catch (error: unknown) {
            logger.error('Failed to list sales', { error });
            const apiResponse: IApiResponse = { type: 'error', messageCode: messageCodes.common.messages.ERROR };
            response.status(500).json(apiResponse);
        }
    }

    async findById(request: IAuthRequest, response: Response): Promise<void> {
        try {
            const id = Number(request.params.id);
            const sale = await this.saleService.findById(id, request.companyId!);

            const apiResponse: IApiResponse = { type: 'success', data: sale };
            response.status(200).json(apiResponse);
        } catch (error: unknown) {
            const typedError = error as { status?: number; messageCode?: string };

            if (typedError.messageCode) {
                response.status(typedError.status || 400).json({ type: 'error', messageCode: typedError.messageCode });
                return;
            }

            logger.error('Failed to find sale', { error });
            response.status(500).json({ type: 'error', messageCode: messageCodes.common.messages.ERROR });
        }
    }

    async findPayment(request: IAuthRequest, response: Response): Promise<void> {
        try {
            const id = Number(request.params.id);
            const payment = await this.saleService.findPayment(id, request.companyId!);

            const apiResponse: IApiResponse = { type: 'success', data: payment };
            response.status(200).json(apiResponse);
        } catch (error: unknown) {
            const typedError = error as { status?: number; messageCode?: string };

            if (typedError.messageCode) {
                response.status(typedError.status || 400).json({ type: 'error', messageCode: typedError.messageCode });
                return;
            }

            logger.error('Failed to find sale payment', { error });
            response.status(500).json({ type: 'error', messageCode: messageCodes.common.messages.ERROR });
        }
    }

    async create(request: IAuthRequest, response: Response): Promise<void> {
        try {
            const sale = await this.saleService.create(request.companyId!, request.userId!, request.body);

            const apiResponse: IApiResponse = { type: 'success', messageCode: messageCodes.common.messages.CREATED, data: sale };
            response.status(201).json(apiResponse);
        } catch (error: unknown) {
            const typedError = error as { status?: number; messageCode?: string };

            if (typedError.messageCode) {
                response.status(typedError.status || 400).json({ type: 'error', messageCode: typedError.messageCode });
                return;
            }

            logger.error('Failed to create sale', { error });
            response.status(500).json({ type: 'error', messageCode: messageCodes.common.messages.ERROR });
        }
    }

    async cancel(request: IAuthRequest, response: Response): Promise<void> {
        try {
            const id = Number(request.params.id);
            await this.saleService.cancel(id, request.companyId!, request.userId!, request.body.reason);

            const apiResponse: IApiResponse = { type: 'success', messageCode: messageCodes.sales.messages.CANCELLED };
            response.status(200).json(apiResponse);
        } catch (error: unknown) {
            const typedError = error as { status?: number; messageCode?: string };

            if (typedError.messageCode) {
                response.status(typedError.status || 400).json({ type: 'error', messageCode: typedError.messageCode });
                return;
            }

            logger.error('Failed to cancel sale', { error });
            response.status(500).json({ type: 'error', messageCode: messageCodes.common.messages.ERROR });
        }
    }
}
