import { Request, Response } from 'express';
import { IAuthRequest } from '../interfaces/IAuthRequest';
import CompanyService from '../services/CompanyService';
import messageCodes from '../i18n/MessageCodes';
import logger from '../helpers/Logger';
import { IApiResponse } from '../interfaces/IApiResponse';

export default class CompanyController {
    private companyService = new CompanyService();

    async findAll(request: Request, response: Response): Promise<void> {
        try {
            const { search, status, page = '1', limit = '20' } = request.query;
            const result = await this.companyService.findAll(search as string, status as string, Number(page), Number(limit));

            const apiResponse: IApiResponse = { type: 'success', data: result };
            response.status(200).json(apiResponse);
        } catch (error: unknown) {
            logger.error('Failed to list companies', { error });
            response.status(500).json({ type: 'error', messageCode: messageCodes.common.messages.ERROR });
        }
    }

    async findById(request: Request, response: Response): Promise<void> {
        try {
            const id = Number(request.params.id);
            const company = await this.companyService.findByIdWithProfile(id);

            const apiResponse: IApiResponse = { type: 'success', data: company };
            response.status(200).json(apiResponse);
        } catch (error: unknown) {
            const typedError = error as { status?: number; messageCode?: string };

            if (typedError.messageCode) {
                response.status(typedError.status || 400).json({ type: 'error', messageCode: typedError.messageCode });
                return;
            }

            logger.error('Failed to find company', { error });
            response.status(500).json({ type: 'error', messageCode: messageCodes.common.messages.ERROR });
        }
    }

    async create(request: Request, response: Response): Promise<void> {
        try {
            const company = await this.companyService.create(request.body);

            const apiResponse: IApiResponse = { type: 'success', messageCode: messageCodes.common.messages.CREATED, data: company };
            response.status(201).json(apiResponse);
        } catch (error: unknown) {
            const typedError = error as { status?: number; messageCode?: string };

            if (typedError.messageCode) {
                response.status(typedError.status || 400).json({ type: 'error', messageCode: typedError.messageCode });
                return;
            }

            logger.error('Failed to create company', { error });
            response.status(500).json({ type: 'error', messageCode: messageCodes.common.messages.ERROR });
        }
    }

    async update(request: Request, response: Response): Promise<void> {
        try {
            const id = Number(request.params.id);
            const company = await this.companyService.update(id, request.body);

            const apiResponse: IApiResponse = { type: 'success', messageCode: messageCodes.common.messages.UPDATED, data: company };
            response.status(200).json(apiResponse);
        } catch (error: unknown) {
            const typedError = error as { status?: number; messageCode?: string };

            if (typedError.messageCode) {
                response.status(typedError.status || 400).json({ type: 'error', messageCode: typedError.messageCode });
                return;
            }

            logger.error('Failed to update company', { error });
            response.status(500).json({ type: 'error', messageCode: messageCodes.common.messages.ERROR });
        }
    }

    async toggleStatus(request: Request, response: Response): Promise<void> {
        try {
            const id = Number(request.params.id);
            const company = await this.companyService.toggleStatus(id);

            const apiResponse: IApiResponse = { type: 'success', messageCode: messageCodes.common.messages.UPDATED, data: company };
            response.status(200).json(apiResponse);
        } catch (error: unknown) {
            const typedError = error as { status?: number; messageCode?: string };

            if (typedError.messageCode) {
                response.status(typedError.status || 400).json({ type: 'error', messageCode: typedError.messageCode });
                return;
            }

            logger.error('Failed to toggle company status', { error });
            response.status(500).json({ type: 'error', messageCode: messageCodes.common.messages.ERROR });
        }
    }

    async findAllActive(_request: Request, response: Response): Promise<void> {
        try {
            const companies = await this.companyService.findAllActive();

            const apiResponse: IApiResponse = { type: 'success', data: companies };
            response.status(200).json(apiResponse);
        } catch (error: unknown) {
            logger.error('Failed to list active companies', { error });
            response.status(500).json({ type: 'error', messageCode: messageCodes.common.messages.ERROR });
        }
    }

    async findBranches(request: Request, response: Response): Promise<void> {
        try {
            const id = Number(request.params.id);
            const branches = await this.companyService.findBranches(id);

            const apiResponse: IApiResponse = { type: 'success', data: branches };
            response.status(200).json(apiResponse);
        } catch (error: unknown) {
            const typedError = error as { status?: number; messageCode?: string };

            if (typedError.messageCode) {
                response.status(typedError.status || 400).json({ type: 'error', messageCode: typedError.messageCode });
                return;
            }

            logger.error('Failed to list company branches', { error });
            response.status(500).json({ type: 'error', messageCode: messageCodes.common.messages.ERROR });
        }
    }

    async inspect(request: IAuthRequest, response: Response): Promise<void> {
        try {
            const id = Number(request.params.id);
            const company = await this.companyService.inspect(id, request.userId!, request.userRole!);

            const apiResponse: IApiResponse = { type: 'success', data: company };
            response.status(200).json(apiResponse);
        } catch (error: unknown) {
            const typedError = error as { status?: number; messageCode?: string };

            if (typedError.messageCode) {
                response.status(typedError.status || 400).json({ type: 'error', messageCode: typedError.messageCode });
                return;
            }

            logger.error('Failed to inspect company', { error });
            response.status(500).json({ type: 'error', messageCode: messageCodes.common.messages.ERROR });
        }
    }

    async leaveInspection(request: IAuthRequest, response: Response): Promise<void> {
        try {
            await this.companyService.leaveInspection(request.userId!);

            const apiResponse: IApiResponse = { type: 'success' };
            response.status(200).json(apiResponse);
        } catch (error: unknown) {
            logger.error('Failed to leave inspection', { error });
            response.status(500).json({ type: 'error', messageCode: messageCodes.common.messages.ERROR });
        }
    }
}
