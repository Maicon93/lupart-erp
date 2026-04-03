import { Response } from 'express';
import { IAuthRequest } from '../interfaces/IAuthRequest';
import CategoryService from '../services/CategoryService';
import messageCodes from '../i18n/MessageCodes';
import logger from '../helpers/Logger';
import { IApiResponse } from '../interfaces/IApiResponse';

export default class CategoryController {
    private categoryService = new CategoryService();

    async findAll(request: IAuthRequest, response: Response): Promise<void> {
        try {
            const { search, status, page = '1', limit = '20' } = request.query;
            const result = await this.categoryService.findAll(
                request.companyId!,
                search as string,
                status as string,
                Number(page),
                Number(limit)
            );

            const apiResponse: IApiResponse = { type: 'success', data: result };
            response.status(200).json(apiResponse);
        } catch (error: unknown) {
            logger.error('Failed to list categories', { error });
            const apiResponse: IApiResponse = { type: 'error', messageCode: messageCodes.common.messages.ERROR };
            response.status(500).json(apiResponse);
        }
    }

    async findById(request: IAuthRequest, response: Response): Promise<void> {
        try {
            const id = Number(request.params.id);
            const category = await this.categoryService.findById(id, request.companyId!);

            const apiResponse: IApiResponse = { type: 'success', data: category };
            response.status(200).json(apiResponse);
        } catch (error: unknown) {
            const typedError = error as { status?: number; messageCode?: string };

            if (typedError.messageCode) {
                response.status(typedError.status || 400).json({ type: 'error', messageCode: typedError.messageCode });
                return;
            }

            logger.error('Failed to find category', { error });
            response.status(500).json({ type: 'error', messageCode: messageCodes.common.messages.ERROR });
        }
    }

    async create(request: IAuthRequest, response: Response): Promise<void> {
        try {
            const category = await this.categoryService.create(request.companyId!, request.body);

            const apiResponse: IApiResponse = { type: 'success', messageCode: messageCodes.common.messages.CREATED, data: category };
            response.status(201).json(apiResponse);
        } catch (error: unknown) {
            const typedError = error as { status?: number; messageCode?: string };

            if (typedError.messageCode) {
                response.status(typedError.status || 400).json({ type: 'error', messageCode: typedError.messageCode });
                return;
            }

            logger.error('Failed to create category', { error });
            response.status(500).json({ type: 'error', messageCode: messageCodes.common.messages.ERROR });
        }
    }

    async update(request: IAuthRequest, response: Response): Promise<void> {
        try {
            const id = Number(request.params.id);
            const category = await this.categoryService.update(id, request.companyId!, request.body);

            const apiResponse: IApiResponse = { type: 'success', messageCode: messageCodes.common.messages.UPDATED, data: category };
            response.status(200).json(apiResponse);
        } catch (error: unknown) {
            const typedError = error as { status?: number; messageCode?: string };

            if (typedError.messageCode) {
                response.status(typedError.status || 400).json({ type: 'error', messageCode: typedError.messageCode });
                return;
            }

            logger.error('Failed to update category', { error });
            response.status(500).json({ type: 'error', messageCode: messageCodes.common.messages.ERROR });
        }
    }

    async toggleStatus(request: IAuthRequest, response: Response): Promise<void> {
        try {
            const id = Number(request.params.id);
            const category = await this.categoryService.toggleStatus(id, request.companyId!);

            const apiResponse: IApiResponse = { type: 'success', messageCode: messageCodes.common.messages.UPDATED, data: category };
            response.status(200).json(apiResponse);
        } catch (error: unknown) {
            const typedError = error as { status?: number; messageCode?: string };

            if (typedError.messageCode) {
                response.status(typedError.status || 400).json({ type: 'error', messageCode: typedError.messageCode });
                return;
            }

            logger.error('Failed to toggle category status', { error });
            response.status(500).json({ type: 'error', messageCode: messageCodes.common.messages.ERROR });
        }
    }

    async remove(request: IAuthRequest, response: Response): Promise<void> {
        try {
            const id = Number(request.params.id);
            await this.categoryService.remove(id, request.companyId!);

            const apiResponse: IApiResponse = { type: 'success', messageCode: messageCodes.common.messages.DELETED };
            response.status(200).json(apiResponse);
        } catch (error: unknown) {
            const typedError = error as { status?: number; messageCode?: string };

            if (typedError.messageCode) {
                response.status(typedError.status || 400).json({ type: 'error', messageCode: typedError.messageCode });
                return;
            }

            logger.error('Failed to delete category', { error });
            response.status(500).json({ type: 'error', messageCode: messageCodes.common.messages.ERROR });
        }
    }
}
