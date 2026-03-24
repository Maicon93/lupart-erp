import { IsNull } from 'typeorm';
import { AppDataSource } from '../config/database';
import { User } from '../models/User';
import { UserProfile } from '../models/UserProfile';
import { UserCompany } from '../models/UserCompany';
import { Role } from '../models/Role';

const repository = AppDataSource.getRepository(User);
const profileRepository = AppDataSource.getRepository(UserProfile);
const userCompanyRepository = AppDataSource.getRepository(UserCompany);

const findAll = async (search?: string, status?: string, page = 1, limit = 20): Promise<{ data: User[]; total: number }> => {
    const query = repository
        .createQueryBuilder('user')
        .leftJoinAndSelect('user.role', 'role')
        .select([
            'user.id',
            'user.name',
            'user.email',
            'user.language',
            'user.roleId',
            'user.companyId',
            'user.status',
            'user.createdAt',
            'user.updatedAt',
            'role.id',
            'role.name',
        ]);

    if (search) {
        query.where('(user.name ILIKE :search OR user.email ILIKE :search)', { search: `%${search}%` });
    }

    if (status && status !== 'all') {
        query.andWhere('user.status = :status', { status });
    }

    query.orderBy('user.id', 'ASC');
    query.skip((page - 1) * limit).take(limit);

    const [data, total] = await query.getManyAndCount();
    return { data, total };
};

const findById = async (id: number): Promise<User | null> => {
    return repository.findOne({
        where: { id },
        relations: ['role'],
        select: ['id', 'name', 'email', 'language', 'roleId', 'companyId', 'status', 'createdAt', 'updatedAt'],
    });
};

const findByIdWithProfile = async (id: number): Promise<{ user: User | null; profile: UserProfile | null; companies: UserCompany[] }> => {
    const user = await repository.findOne({
        where: { id },
        relations: ['role'],
        select: ['id', 'name', 'email', 'language', 'roleId', 'companyId', 'status', 'createdAt', 'updatedAt'],
    });

    const profile = user ? await profileRepository.findOne({ where: { userId: id } }) : null;

    const companies = user ? await userCompanyRepository.find({ where: { userId: id }, relations: ['company'] }) : [];

    return { user, profile, companies };
};

const findByEmail = async (email: string): Promise<User | null> => {
    return repository.findOne({ where: { email } });
};

const findAllActive = async (): Promise<User[]> => {
    return repository.find({
        where: { status: 'active' as User['status'] },
        select: ['id', 'name', 'email'],
    });
};

const findGlobalRoles = async (): Promise<Role[]> => {
    const roleRepository = AppDataSource.getRepository(Role);
    return roleRepository.find({
        where: { companyId: IsNull() },
        select: ['id', 'name'],
    });
};

export default { findAll, findById, findByIdWithProfile, findByEmail, findAllActive, findGlobalRoles };
