import { AppDataSource } from '../config/database';
import { User } from '../models/User';
import { UserProfile } from '../models/UserProfile';
import { RefreshToken } from '../models/RefreshToken';
import { UserCompany } from '../models/UserCompany';

export default class AuthRepository {
    private static userRepository = AppDataSource.getRepository(User);
    private static userProfileRepository = AppDataSource.getRepository(UserProfile);
    private static refreshTokenRepository = AppDataSource.getRepository(RefreshToken);
    private static userCompanyRepository = AppDataSource.getRepository(UserCompany);

    static async findUserByEmail(email: string): Promise<User | null> {
        return this.userRepository.findOne({
            where: { email },
            relations: ['role'],
        });
    }

    static async findUserById(id: number): Promise<User | null> {
        return this.userRepository.findOne({
            where: { id },
            relations: ['role'],
        });
    }

    static async findUserProfile(userId: number): Promise<UserProfile | null> {
        return this.userProfileRepository.findOne({
            where: { userId },
        });
    }

    static async findUserCompanies(userId: number): Promise<UserCompany[]> {
        return this.userCompanyRepository.find({
            where: { userId },
            relations: ['company'],
        });
    }

    static async saveRefreshToken(userId: number, token: string, expiresAt: Date): Promise<RefreshToken> {
        const refreshToken = this.refreshTokenRepository.create({ userId, token, expiresAt });
        return this.refreshTokenRepository.save(refreshToken);
    }

    static async findRefreshToken(token: string): Promise<RefreshToken | null> {
        return this.refreshTokenRepository.findOne({
            where: { token },
            relations: ['user', 'user.role'],
        });
    }

    static async deleteRefreshToken(token: string): Promise<void> {
        await this.refreshTokenRepository.delete({ token });
    }

    static async updateUserProfile(profileId: number, data: Partial<{ theme: string; language: string }>): Promise<void> {
        await this.userProfileRepository.update(profileId, data);
    }

    static async deleteUserRefreshTokens(userId: number): Promise<void> {
        await this.refreshTokenRepository.delete({ userId });
    }
}

