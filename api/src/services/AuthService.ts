import bcrypt from 'bcryptjs';
import AuthRepository from '../repositories/AuthRepository';
import JWTUtil from '../helpers/JWTUtil';
import messageCodes from '../i18n/MessageCodes';
import { UserStatus } from '../models/User';
import { ITokenPair } from '../interfaces/ITokenPair';

interface ILoginResult extends ITokenPair {
    user: {
        name: string;
        language: string;
        theme: string;
    };
    role: string;
    companies: { id: number; name: string; logoUrl: string | null }[];
}

type IRefreshResult = ITokenPair;

export default class AuthService {
    static async login(email: string, password: string): Promise<ILoginResult> {
        const user = await AuthRepository.findUserByEmail(email);

        if (!user || !(await bcrypt.compare(password, user.password))) {
            throw { status: 401, messageCode: messageCodes.auth.errors.INVALID_CREDENTIALS };
        }

        if (user.status === UserStatus.INACTIVE) {
            throw { status: 403, messageCode: messageCodes.auth.errors.USER_INACTIVE };
        }

        const roleName = user.role.name;
        const accessToken = JWTUtil.generateAccessToken({ userId: user.id, role: roleName });
        const refreshToken = JWTUtil.generateRefreshToken();
        const expiresAt = JWTUtil.getRefreshExpiresAt();

        await AuthRepository.saveRefreshToken(user.id, refreshToken, expiresAt);

        const userCompanies = await AuthRepository.findUserCompanies(user.id);
        const companies = userCompanies.map((userCompany) => ({
            id: userCompany.company.id,
            name: userCompany.company.name,
            logoUrl: userCompany.company.logoUrl,
        }));

        if (roleName !== 'admin' && !user.companyId) {
            throw { status: 403, messageCode: messageCodes.auth.errors.USER_NO_COMPANY };
        }

        const profile = await AuthRepository.findUserProfile(user.id);

        return {
            token: accessToken,
            refreshToken,
            user: {
                name: user.name,
                language: profile?.language ?? 'pt-BR',
                theme: profile?.theme ?? 'light',
            },
            role: roleName,
            companies,
        };
    }

    static async refresh(currentRefreshToken: string): Promise<IRefreshResult> {
        const storedToken = await AuthRepository.findRefreshToken(currentRefreshToken);

        if (!storedToken || storedToken.expiresAt < new Date()) {
            if (storedToken) {
                await AuthRepository.deleteRefreshToken(currentRefreshToken);
            }
            throw { status: 401, messageCode: messageCodes.auth.errors.INVALID_REFRESH_TOKEN };
        }

        const user = storedToken.user;
        const roleName = user.role.name;

        await AuthRepository.deleteRefreshToken(currentRefreshToken);

        const newAccessToken = JWTUtil.generateAccessToken({ userId: user.id, role: roleName });
        const newRefreshToken = JWTUtil.generateRefreshToken();
        const expiresAt = JWTUtil.getRefreshExpiresAt();

        await AuthRepository.saveRefreshToken(user.id, newRefreshToken, expiresAt);

        return {
            token: newAccessToken,
            refreshToken: newRefreshToken,
        };
    }

    static async updatePreferences(userId: number, preferences: { theme?: string; language?: string }): Promise<void> {
        const profile = await AuthRepository.findUserProfile(userId);

        if (!profile) {
            throw { status: 404, messageCode: messageCodes.common.messages.NOT_FOUND };
        }

        const updateData: Partial<{ theme: string; language: string }> = {};

        if (preferences.theme) {
            updateData.theme = preferences.theme;
        }

        if (preferences.language) {
            updateData.language = preferences.language;
        }

        await AuthRepository.updateUserProfile(profile.id, updateData);
    }

    static async logout(refreshToken: string): Promise<void> {
        await AuthRepository.deleteRefreshToken(refreshToken);
    }
}

