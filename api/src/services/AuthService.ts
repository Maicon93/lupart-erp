import bcrypt from 'bcryptjs';
import AuthRepository from '../repositories/AuthRepository';
import { generateAccessToken, generateRefreshToken, getRefreshExpiresAt } from '../helpers/JWTUtil';
import messageCodes from '../i18n/MessageCodes';
import { UserStatus } from '../models/User';
import { ITokenPair } from '../interfaces/ITokenPair';

interface ICompany {
    id: number;
    name: string;
    logoUrl: string | null;
}

interface ILoginResult extends ITokenPair {
    user: {
        name: string;
        language: string;
        theme: string;
    };
    role: string;
    company: ICompany | null;
    companies: ICompany[];
}

type IRefreshResult = ITokenPair;

export default class AuthService {
    private authRepository = new AuthRepository();

    async login(email: string, password: string): Promise<ILoginResult> {
        const user = await this.authRepository.findUserByEmail(email);

        if (!user || !(await bcrypt.compare(password, user.password))) {
            throw { status: 401, messageCode: messageCodes.auth.errors.INVALID_CREDENTIALS };
        }

        if (user.status === UserStatus.INACTIVE) {
            throw { status: 403, messageCode: messageCodes.auth.errors.USER_INACTIVE };
        }

        const roleName = user.role.name;
        const accessToken = generateAccessToken({ userId: user.id, role: roleName });
        const refreshToken = generateRefreshToken();
        const expiresAt = getRefreshExpiresAt();

        await this.authRepository.saveRefreshToken(user.id, refreshToken, expiresAt);

        const userCompanies = await this.authRepository.findUserCompanies(user.id);
        const companies = userCompanies.map((userCompany) => ({
            id: userCompany.company.id,
            name: userCompany.company.name,
            logoUrl: userCompany.company.logoUrl,
        }));

        if (roleName !== 'admin' && !user.companyId) {
            throw { status: 403, messageCode: messageCodes.auth.errors.USER_NO_COMPANY };
        }

        const profile = await this.authRepository.findUserProfile(user.id);

        const company = user.company
            ? { id: user.company.id, name: user.company.name, logoUrl: user.company.logoUrl ?? null }
            : null;

        return {
            token: accessToken,
            refreshToken,
            user: {
                name: user.name,
                language: profile?.language ?? 'pt-BR',
                theme: profile?.theme ?? 'light',
            },
            role: roleName,
            company,
            companies,
        };
    }

    async refresh(currentRefreshToken: string): Promise<IRefreshResult> {
        const storedToken = await this.authRepository.findRefreshToken(currentRefreshToken);

        if (!storedToken || storedToken.expiresAt < new Date()) {
            if (storedToken) {
                await this.authRepository.deleteRefreshToken(currentRefreshToken);
            }
            throw { status: 401, messageCode: messageCodes.auth.errors.INVALID_REFRESH_TOKEN };
        }

        const user = storedToken.user;
        const roleName = user.role.name;

        await this.authRepository.deleteRefreshToken(currentRefreshToken);

        const newAccessToken = generateAccessToken({ userId: user.id, role: roleName });
        const newRefreshToken = generateRefreshToken();
        const expiresAt = getRefreshExpiresAt();

        await this.authRepository.saveRefreshToken(user.id, newRefreshToken, expiresAt);

        return {
            token: newAccessToken,
            refreshToken: newRefreshToken,
        };
    }

    async updatePreferences(userId: number, preferences: { theme?: string; language?: string }): Promise<void> {
        const profile = await this.authRepository.findUserProfile(userId);

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

        await this.authRepository.updateUserProfile(profile.id, updateData);
    }

    async logout(refreshToken: string): Promise<void> {
        await this.authRepository.deleteRefreshToken(refreshToken);
    }
}

