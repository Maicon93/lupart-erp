import bcrypt from 'bcryptjs';
import AuthRepository from '../repositories/AuthRepository';
import JWTUtil from '../helpers/JWTUtil';
import messageCodes from '../i18n/MessageCodes';
import { UserStatus } from '../models/User';

interface ILoginResult {
    token: string;
    refreshToken: string;
    user: {
        id: number;
        name: string;
        email: string;
        language: string;
    };
    role: string;
    companies: { id: number; name: string; logoUrl: string | null }[];
}

interface IRefreshResult {
    token: string;
    refreshToken: string;
}

const login = async (email: string, password: string): Promise<ILoginResult> => {
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

    return {
        token: accessToken,
        refreshToken,
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            language: user.language,
        },
        role: roleName,
        companies,
    };
};

const refresh = async (currentRefreshToken: string): Promise<IRefreshResult> => {
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
};

const logout = async (refreshToken: string): Promise<void> => {
    await AuthRepository.deleteRefreshToken(refreshToken);
};

export default { login, refresh, logout };
