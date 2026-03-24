import { Request, Response } from 'express';
import CompanyService from '../services/CompanyService';
import messageCodes from '../i18n/MessageCodes';
import logger from '../helpers/Logger';
import { IApiResponse } from '../interfaces/IApiResponse';

const findAll = async (request: Request, response: Response): Promise<void> => {
    try {
        const { search, status, page = '1', limit = '20' } = request.query;
        const result = await CompanyService.findAll(
            search as string,
            status as string,
            parseInt(page as string),
            parseInt(limit as string)
        );

        const apiResponse: IApiResponse = {
            type: 'success',
            data: result,
        };

        response.status(200).json(apiResponse);
    } catch (error: unknown) {
        logger.error('Failed to list companies', { error });
        response.status(500).json({ type: 'error', messageCode: messageCodes.common.messages.ERROR });
    }
};

const findById = async (request: Request, response: Response): Promise<void> => {
    try {
        const { id } = request.params;
        const company = await CompanyService.findByIdWithProfile(parseInt(id));

        const apiResponse: IApiResponse = {
            type: 'success',
            data: company,
        };

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
};

const create = async (request: Request, response: Response): Promise<void> => {
    try {
        const company = await CompanyService.create(request.body);

        const apiResponse: IApiResponse = {
            type: 'success',
            messageCode: messageCodes.common.messages.CREATED,
            data: company,
        };

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
};

const update = async (request: Request, response: Response): Promise<void> => {
    try {
        const { id } = request.params;
        const company = await CompanyService.update(parseInt(id), request.body);

        const apiResponse: IApiResponse = {
            type: 'success',
            messageCode: messageCodes.common.messages.UPDATED,
            data: company,
        };

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
};

const toggleStatus = async (request: Request, response: Response): Promise<void> => {
    try {
        const { id } = request.params;
        const company = await CompanyService.toggleStatus(parseInt(id));

        const apiResponse: IApiResponse = {
            type: 'success',
            messageCode: messageCodes.common.messages.UPDATED,
            data: company,
        };

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
};

const findAllActive = async (_request: Request, response: Response): Promise<void> => {
    try {
        const companies = await CompanyService.findAllActive();

        const apiResponse: IApiResponse = {
            type: 'success',
            data: companies,
        };

        response.status(200).json(apiResponse);
    } catch (error: unknown) {
        logger.error('Failed to list active companies', { error });
        response.status(500).json({ type: 'error', messageCode: messageCodes.common.messages.ERROR });
    }
};

const findBranches = async (request: Request, response: Response): Promise<void> => {
    try {
        const { id } = request.params;
        const branches = await CompanyService.findBranches(parseInt(id));

        const apiResponse: IApiResponse = {
            type: 'success',
            data: branches,
        };

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
};

export default { findAll, findById, create, update, toggleStatus, findAllActive, findBranches };
