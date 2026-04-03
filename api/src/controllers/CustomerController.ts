import { Response } from 'express';
import { IAuthRequest } from '../interfaces/IAuthRequest';
import CustomerService from '../services/CustomerService';
import messageCodes from '../i18n/MessageCodes';
import logger from '../helpers/Logger';
import { IApiResponse } from '../interfaces/IApiResponse';

export default class CustomerController {
    private customerService = new CustomerService();

    async findAll(request: IAuthRequest, response: Response): Promise<void> {
        try {
            const { search, page = '1', limit = '20' } = request.query;
            const result = await this.customerService.findAll(
                request.companyId!,
                search as string,
                Number(page),
                Number(limit)
            );

            const apiResponse: IApiResponse = { type: 'success', data: result };
            response.status(200).json(apiResponse);
        } catch (error: unknown) {
            logger.error('Failed to list customers', { error });
            const apiResponse: IApiResponse = { type: 'error', messageCode: messageCodes.common.messages.ERROR };
            response.status(500).json(apiResponse);
        }
    }

    async findById(request: IAuthRequest, response: Response): Promise<void> {
        try {
            const id = Number(request.params.id);
            const customer = await this.customerService.findById(id, request.companyId!);

            const apiResponse: IApiResponse = { type: 'success', data: customer };
            response.status(200).json(apiResponse);
        } catch (error: unknown) {
            const typedError = error as { status?: number; messageCode?: string };

            if (typedError.messageCode) {
                response.status(typedError.status || 400).json({ type: 'error', messageCode: typedError.messageCode });
                return;
            }

            logger.error('Failed to find customer', { error });
            response.status(500).json({ type: 'error', messageCode: messageCodes.common.messages.ERROR });
        }
    }

    async create(request: IAuthRequest, response: Response): Promise<void> {
        try {
            const customer = await this.customerService.create(request.companyId!, request.body);

            const apiResponse: IApiResponse = { type: 'success', messageCode: messageCodes.common.messages.CREATED, data: customer };
            response.status(201).json(apiResponse);
        } catch (error: unknown) {
            const typedError = error as { status?: number; messageCode?: string };

            if (typedError.messageCode) {
                response.status(typedError.status || 400).json({ type: 'error', messageCode: typedError.messageCode });
                return;
            }

            logger.error('Failed to create customer', { error });
            response.status(500).json({ type: 'error', messageCode: messageCodes.common.messages.ERROR });
        }
    }

    async update(request: IAuthRequest, response: Response): Promise<void> {
        try {
            const id = Number(request.params.id);
            const customer = await this.customerService.update(id, request.companyId!, request.body);

            const apiResponse: IApiResponse = { type: 'success', messageCode: messageCodes.common.messages.UPDATED, data: customer };
            response.status(200).json(apiResponse);
        } catch (error: unknown) {
            const typedError = error as { status?: number; messageCode?: string };

            if (typedError.messageCode) {
                response.status(typedError.status || 400).json({ type: 'error', messageCode: typedError.messageCode });
                return;
            }

            logger.error('Failed to update customer', { error });
            response.status(500).json({ type: 'error', messageCode: messageCodes.common.messages.ERROR });
        }
    }

    async remove(request: IAuthRequest, response: Response): Promise<void> {
        try {
            const id = Number(request.params.id);
            await this.customerService.remove(id, request.companyId!);

            const apiResponse: IApiResponse = { type: 'success', messageCode: messageCodes.common.messages.DELETED };
            response.status(200).json(apiResponse);
        } catch (error: unknown) {
            const typedError = error as { status?: number; messageCode?: string };

            if (typedError.messageCode) {
                response.status(typedError.status || 400).json({ type: 'error', messageCode: typedError.messageCode });
                return;
            }

            logger.error('Failed to delete customer', { error });
            response.status(500).json({ type: 'error', messageCode: messageCodes.common.messages.ERROR });
        }
    }
}
