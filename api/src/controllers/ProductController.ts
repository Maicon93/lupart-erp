import { Response } from 'express';
import { IAuthRequest } from '../interfaces/IAuthRequest';
import ProductService from '../services/ProductService';
import messageCodes from '../i18n/MessageCodes';
import logger from '../helpers/Logger';
import { IApiResponse } from '../interfaces/IApiResponse';

const findAll = async (request: IAuthRequest, response: Response): Promise<void> => {
    try {
        const { search, type, categoryId, status, page = '1', limit = '20' } = request.query;
        const result = await ProductService.findAll(
            request.companyId!,
            search as string,
            type as string,
            categoryId ? Number(categoryId) : undefined,
            status as string,
            Number(page),
            Number(limit)
        );

        const apiResponse: IApiResponse = { type: 'success', data: result };
        response.status(200).json(apiResponse);
    } catch (error: unknown) {
        logger.error('Failed to list products', { error });
        const apiResponse: IApiResponse = { type: 'error', messageCode: messageCodes.common.messages.ERROR };
        response.status(500).json(apiResponse);
    }
};

const findById = async (request: IAuthRequest, response: Response): Promise<void> => {
    try {
        const id = Number(request.params.id);
        const product = await ProductService.findById(id, request.companyId!);

        const apiResponse: IApiResponse = { type: 'success', data: product };
        response.status(200).json(apiResponse);
    } catch (error: unknown) {
        const typedError = error as { status?: number; messageCode?: string };

        if (typedError.messageCode) {
            response.status(typedError.status || 400).json({ type: 'error', messageCode: typedError.messageCode });
            return;
        }

        logger.error('Failed to find product', { error });
        response.status(500).json({ type: 'error', messageCode: messageCodes.common.messages.ERROR });
    }
};

const create = async (request: IAuthRequest, response: Response): Promise<void> => {
    try {
        const product = await ProductService.create(request.companyId!, request.body);

        const apiResponse: IApiResponse = { type: 'success', messageCode: messageCodes.common.messages.CREATED, data: product };
        response.status(201).json(apiResponse);
    } catch (error: unknown) {
        const typedError = error as { status?: number; messageCode?: string };

        if (typedError.messageCode) {
            response.status(typedError.status || 400).json({ type: 'error', messageCode: typedError.messageCode });
            return;
        }

        logger.error('Failed to create product', { error });
        response.status(500).json({ type: 'error', messageCode: messageCodes.common.messages.ERROR });
    }
};

const update = async (request: IAuthRequest, response: Response): Promise<void> => {
    try {
        const id = Number(request.params.id);
        const product = await ProductService.update(id, request.companyId!, request.body);

        const apiResponse: IApiResponse = { type: 'success', messageCode: messageCodes.common.messages.UPDATED, data: product };
        response.status(200).json(apiResponse);
    } catch (error: unknown) {
        const typedError = error as { status?: number; messageCode?: string };

        if (typedError.messageCode) {
            response.status(typedError.status || 400).json({ type: 'error', messageCode: typedError.messageCode });
            return;
        }

        logger.error('Failed to update product', { error });
        response.status(500).json({ type: 'error', messageCode: messageCodes.common.messages.ERROR });
    }
};

const toggleStatus = async (request: IAuthRequest, response: Response): Promise<void> => {
    try {
        const id = Number(request.params.id);
        const product = await ProductService.toggleStatus(id, request.companyId!);

        const apiResponse: IApiResponse = { type: 'success', messageCode: messageCodes.common.messages.UPDATED, data: product };
        response.status(200).json(apiResponse);
    } catch (error: unknown) {
        const typedError = error as { status?: number; messageCode?: string };

        if (typedError.messageCode) {
            response.status(typedError.status || 400).json({ type: 'error', messageCode: typedError.messageCode });
            return;
        }

        logger.error('Failed to toggle product status', { error });
        response.status(500).json({ type: 'error', messageCode: messageCodes.common.messages.ERROR });
    }
};

export default { findAll, findById, create, update, toggleStatus };
