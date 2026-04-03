import bcrypt from 'bcryptjs';
import { AppDataSource } from '../config/database';
import UserRepository from '../repositories/UserRepository';
import { User, UserStatus } from '../models/User';
import { UserProfile } from '../models/UserProfile';
import { UserCompany } from '../models/UserCompany';
import messageCodes from '../i18n/MessageCodes';

interface IUserInput {
    name: string;
    email: string;
    password?: string;
    confirmPassword?: string;
    phone: string;
    country: string;
    language: string;
    roleId: number;
    companyId: number;
}

const findAll = async (search?: string, status?: string, page = 1, limit = 20): Promise<{ data: User[]; total: number }> => {
    return UserRepository.findAll(search, status, page, limit);
};

const findById = async (id: number): Promise<User> => {
    const user = await UserRepository.findById(id);

    if (!user) {
        throw { status: 404, messageCode: messageCodes.common.messages.NOT_FOUND };
    }

    return user;
};

const findByIdWithProfile = async (id: number): Promise<User & { profile: UserProfile | null; companies: UserCompany[] }> => {
    const { user, profile, companies } = await UserRepository.findByIdWithProfile(id);

    if (!user) {
        throw { status: 404, messageCode: messageCodes.common.messages.NOT_FOUND };
    }

    return { ...user, profile, companies };
};

const create = async (input: IUserInput, currentUserId: number): Promise<User> => {
    const existingUser = await UserRepository.findByEmail(input.email);

    if (existingUser) {
        throw { status: 400, messageCode: messageCodes.users.errors.EMAIL_ALREADY_EXISTS };
    }

    const hashedPassword = await bcrypt.hash(input.password!, 10);

    return AppDataSource.transaction(async (manager) => {
        const entity = manager.create(User, {
            name: input.name,
            email: input.email,
            password: hashedPassword,
            language: input.language,
            roleId: input.roleId,
            companyId: input.companyId,
            status: UserStatus.ACTIVE,
        });

        const user = await manager.save(entity);

        const profile = manager.create(UserProfile, {
            userId: user.id,
            phone: input.phone,
            country: input.country,
        });

        await manager.save(profile);

        const userCompany = manager.create(UserCompany, {
            userId: user.id,
            companyId: input.companyId,
            createdBy: currentUserId,
        });

        await manager.save(userCompany);

        const { password: _, ...userWithoutPassword } = user;
        return userWithoutPassword as User;
    });
};

const update = async (id: number, input: IUserInput, currentUserId: number): Promise<User> => {
    const user = await findById(id);

    const existingUser = await UserRepository.findByEmail(input.email);

    if (existingUser && existingUser.id !== id) {
        throw { status: 400, messageCode: messageCodes.users.errors.EMAIL_ALREADY_EXISTS };
    }

    return AppDataSource.transaction(async (manager) => {
        const updateData: Partial<User> = {
            name: input.name,
            email: input.email,
            language: input.language,
            roleId: input.roleId,
            companyId: input.companyId,
        };

        if (input.password && input.password !== '') {
            updateData.password = await bcrypt.hash(input.password, 10);
        }

        await manager.update(User, user.id, updateData);

        const existingProfile = await manager.findOne(UserProfile, { where: { userId: user.id } });

        if (existingProfile) {
            await manager.update(UserProfile, existingProfile.id, {
                phone: input.phone,
                country: input.country,
            });
        } else {
            const profile = manager.create(UserProfile, {
                userId: user.id,
                phone: input.phone,
                country: input.country,
            });

            await manager.save(profile);
        }

        await manager.delete(UserCompany, { userId: user.id });

        const userCompany = manager.create(UserCompany, {
            userId: user.id,
            companyId: input.companyId,
            createdBy: currentUserId,
        });

        await manager.save(userCompany);

        return manager.findOneOrFail(User, {
            where: { id: user.id },
            select: ['id', 'name', 'email', 'language', 'roleId', 'companyId', 'status', 'createdAt', 'updatedAt'],
        });
    });
};

const toggleStatus = async (id: number): Promise<User> => {
    const user = await findById(id);
    const newStatus = user.status === UserStatus.ACTIVE ? UserStatus.INACTIVE : UserStatus.ACTIVE;

    return AppDataSource.transaction(async (manager) => {
        await manager.update(User, user.id, { status: newStatus });
        return manager.findOneOrFail(User, {
            where: { id: user.id },
            select: ['id', 'name', 'email', 'language', 'roleId', 'companyId', 'status', 'createdAt', 'updatedAt'],
        });
    });
};

const findAllActive = async (): Promise<User[]> => {
    return UserRepository.findAllActive();
};

const findGlobalRoles = async () => {
    return UserRepository.findGlobalRoles();
};

export default { findAll, findById, findByIdWithProfile, create, update, toggleStatus, findAllActive, findGlobalRoles };
