import { Response } from 'express';
import { IAuthRequest } from '../interfaces/IAuthRequest';
import SupplierService from '../services/SupplierService';
import messageCodes from '../i18n/MessageCodes';
import logger from '../helpers/Logger';
import { IApiResponse } from '../interfaces/IApiResponse';

const findAll = async (request: IAuthRequest, response: Response): Promise<void> => {
    try {
        const { search, page = '1', limit = '20' } = request.query;
        const result = await SupplierService.findAll(
            request.companyId!,
            search as string,
            Number(page),
            Number(limit)
        );

        const apiResponse: IApiResponse = { type: 'success', data: result };
        response.status(200).json(apiResponse);
    } catch (error: unknown) {
        logger.error('Failed to list suppliers', { error });
        const apiResponse: IApiResponse = { type: 'error', messageCode: messageCodes.common.messages.ERROR };
        response.status(500).json(apiResponse);
    }
};

const findById = async (request: IAuthRequest, response: Response): Promise<void> => {
    try {
        const id = Number(request.params.id);
        const supplier = await SupplierService.findById(id, request.companyId!);

        const apiResponse: IApiResponse = { type: 'success', data: supplier };
        response.status(200).json(apiResponse);
    } catch (error: unknown) {
        const typedError = error as { status?: number; messageCode?: string };

        if (typedError.messageCode) {
            response.status(typedError.status || 400).json({ type: 'error', messageCode: typedError.messageCode });
            return;
        }

        logger.error('Failed to find supplier', { error });
        response.status(500).json({ type: 'error', messageCode: messageCodes.common.messages.ERROR });
    }
};

const create = async (request: IAuthRequest, response: Response): Promise<void> => {
    try {
        const supplier = await SupplierService.create(request.companyId!, request.body);

        const apiResponse: IApiResponse = { type: 'success', messageCode: messageCodes.common.messages.CREATED, data: supplier };
        response.status(201).json(apiResponse);
    } catch (error: unknown) {
        const typedError = error as { status?: number; messageCode?: string };

        if (typedError.messageCode) {
            response.status(typedError.status || 400).json({ type: 'error', messageCode: typedError.messageCode });
            return;
        }

        logger.error('Failed to create supplier', { error });
        response.status(500).json({ type: 'error', messageCode: messageCodes.common.messages.ERROR });
    }
};

const update = async (request: IAuthRequest, response: Response): Promise<void> => {
    try {
        const id = Number(request.params.id);
        const supplier = await SupplierService.update(id, request.companyId!, request.body);

        const apiResponse: IApiResponse = { type: 'success', messageCode: messageCodes.common.messages.UPDATED, data: supplier };
        response.status(200).json(apiResponse);
    } catch (error: unknown) {
        const typedError = error as { status?: number; messageCode?: string };

        if (typedError.messageCode) {
            response.status(typedError.status || 400).json({ type: 'error', messageCode: typedError.messageCode });
            return;
        }

        logger.error('Failed to update supplier', { error });
        response.status(500).json({ type: 'error', messageCode: messageCodes.common.messages.ERROR });
    }
};

const remove = async (request: IAuthRequest, response: Response): Promise<void> => {
    try {
        const id = Number(request.params.id);
        await SupplierService.remove(id, request.companyId!);

        const apiResponse: IApiResponse = { type: 'success', messageCode: messageCodes.common.messages.DELETED };
        response.status(200).json(apiResponse);
    } catch (error: unknown) {
        const typedError = error as { status?: number; messageCode?: string };

        if (typedError.messageCode) {
            response.status(typedError.status || 400).json({ type: 'error', messageCode: typedError.messageCode });
            return;
        }

        logger.error('Failed to delete supplier', { error });
        response.status(500).json({ type: 'error', messageCode: messageCodes.common.messages.ERROR });
    }
};

export default { findAll, findById, create, update, remove };
