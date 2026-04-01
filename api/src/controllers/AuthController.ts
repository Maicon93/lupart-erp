import { Request, Response } from 'express';
import AuthService from '../services/AuthService';
import messageCodes from '../i18n/MessageCodes';
import logger from '../helpers/Logger';
import { IApiResponse } from '../interfaces/IApiResponse';

const REFRESH_COOKIE_NAME = 'refreshToken';
const REFRESH_COOKIE_MAX_AGE = 7 * 24 * 60 * 60 * 1000;

const setRefreshCookie = (response: Response, token: string): void => {
    response.cookie(REFRESH_COOKIE_NAME, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: REFRESH_COOKIE_MAX_AGE,
        path: '/',
    });
};

const clearRefreshCookie = (response: Response): void => {
    response.clearCookie(REFRESH_COOKIE_NAME, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
    });
};

const login = async (request: Request, response: Response): Promise<void> => {
    try {
        const { email, password } = request.body;
        const result = await AuthService.login(email, password);

        setRefreshCookie(response, result.refreshToken);

        const apiResponse: IApiResponse = {
            type: 'success',
            data: {
                token: result.token,
                user: result.user,
                role: result.role,
                companies: result.companies,
            },
        };

        response.status(200).json(apiResponse);
    } catch (error: unknown) {
        const typedError = error as { status?: number; messageCode?: string };

        if (typedError.messageCode) {
            const apiResponse: IApiResponse = {
                type: 'error',
                messageCode: typedError.messageCode,
            };
            response.status(typedError.status || 400).json(apiResponse);
            return;
        }

        logger.error('Login failed', { error });
        const apiResponse: IApiResponse = {
            type: 'error',
            messageCode: messageCodes.common.messages.ERROR,
        };
        response.status(500).json(apiResponse);
    }
};

const refresh = async (request: Request, response: Response): Promise<void> => {
    try {
        const currentRefreshToken = request.cookies[REFRESH_COOKIE_NAME];

        if (!currentRefreshToken) {
            const apiResponse: IApiResponse = {
                type: 'error',
                messageCode: messageCodes.auth.errors.INVALID_REFRESH_TOKEN,
            };
            response.status(401).json(apiResponse);
            return;
        }

        const result = await AuthService.refresh(currentRefreshToken);

        setRefreshCookie(response, result.refreshToken);

        const apiResponse: IApiResponse = {
            type: 'success',
            data: { token: result.token },
        };

        response.status(200).json(apiResponse);
    } catch (error: unknown) {
        clearRefreshCookie(response);

        const typedError = error as { status?: number; messageCode?: string };

        if (typedError.messageCode) {
            const apiResponse: IApiResponse = {
                type: 'error',
                messageCode: typedError.messageCode,
            };
            response.status(typedError.status || 401).json(apiResponse);
            return;
        }

        logger.error('Token refresh failed', { error });
        const apiResponse: IApiResponse = {
            type: 'error',
            messageCode: messageCodes.common.messages.ERROR,
        };
        response.status(500).json(apiResponse);
    }
};

const logout = async (request: Request, response: Response): Promise<void> => {
    try {
        const refreshToken = request.cookies[REFRESH_COOKIE_NAME];

        if (refreshToken) {
            await AuthService.logout(refreshToken);
        }

        clearRefreshCookie(response);

        const apiResponse: IApiResponse = {
            type: 'success',
            messageCode: messageCodes.auth.messages.LOGOUT_SUCCESS,
        };

        response.status(200).json(apiResponse);
    } catch (error: unknown) {
        logger.error('Logout failed', { error });
        clearRefreshCookie(response);

        const apiResponse: IApiResponse = {
            type: 'error',
            messageCode: messageCodes.common.messages.ERROR,
        };
        response.status(500).json(apiResponse);
    }
};

export default { login, refresh, logout };
