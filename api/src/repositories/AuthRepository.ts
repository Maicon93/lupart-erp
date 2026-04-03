import { AppDataSource } from '../config/database';
import { User } from '../models/User';
import { UserProfile } from '../models/UserProfile';
import { RefreshToken } from '../models/RefreshToken';
import { UserCompany } from '../models/UserCompany';

const userRepository = AppDataSource.getRepository(User);
const userProfileRepository = AppDataSource.getRepository(UserProfile);
const refreshTokenRepository = AppDataSource.getRepository(RefreshToken);
const userCompanyRepository = AppDataSource.getRepository(UserCompany);

const findUserByEmail = async (email: string): Promise<User | null> => {
    return userRepository.findOne({
        where: { email },
        relations: ['role'],
    });
};

const findUserById = async (id: number): Promise<User | null> => {
    return userRepository.findOne({
        where: { id },
        relations: ['role'],
    });
};

const findUserProfile = async (userId: number): Promise<UserProfile | null> => {
    return userProfileRepository.findOne({
        where: { userId },
    });
};

const findUserCompanies = async (userId: number): Promise<UserCompany[]> => {
    return userCompanyRepository.find({
        where: { userId },
        relations: ['company'],
    });
};

const saveRefreshToken = async (userId: number, token: string, expiresAt: Date): Promise<RefreshToken> => {
    const refreshToken = refreshTokenRepository.create({ userId, token, expiresAt });
    return refreshTokenRepository.save(refreshToken);
};

const findRefreshToken = async (token: string): Promise<RefreshToken | null> => {
    return refreshTokenRepository.findOne({
        where: { token },
        relations: ['user', 'user.role'],
    });
};

const deleteRefreshToken = async (token: string): Promise<void> => {
    await refreshTokenRepository.delete({ token });
};

const updateUserProfile = async (profileId: number, data: Partial<{ theme: string; language: string }>): Promise<void> => {
    await userProfileRepository.update(profileId, data);
};

const deleteUserRefreshTokens = async (userId: number): Promise<void> => {
    await refreshTokenRepository.delete({ userId });
};

export default {
    findUserByEmail,
    findUserById,
    findUserProfile,
    updateUserProfile,
    findUserCompanies,
    saveRefreshToken,
    findRefreshToken,
    deleteRefreshToken,
    deleteUserRefreshTokens,
};
