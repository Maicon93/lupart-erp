import { IsNull } from 'typeorm';
import { AppDataSource } from '../config/database';
import { User } from '../models/User';
import { UserProfile } from '../models/UserProfile';
import { UserCompany } from '../models/UserCompany';
import { Role } from '../models/Role';

export default class UserRepository {
    private static repository = AppDataSource.getRepository(User);
    private static profileRepository = AppDataSource.getRepository(UserProfile);
    private static userCompanyRepository = AppDataSource.getRepository(UserCompany);

    static async findAll(search?: string, status?: string, page = 1, limit = 20): Promise<{ data: User[]; total: number }> {
        const query = this.repository
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
    }

    static async findById(id: number): Promise<User | null> {
        return this.repository.findOne({
            where: { id },
            relations: ['role'],
            select: ['id', 'name', 'email', 'roleId', 'companyId', 'status', 'createdAt', 'updatedAt'],
        });
    }

    static async findByIdWithProfile(id: number): Promise<{ user: User | null; profile: UserProfile | null; companies: UserCompany[] }> {
        const user = await this.repository.findOne({
            where: { id },
            relations: ['role'],
            select: ['id', 'name', 'email', 'roleId', 'companyId', 'status', 'createdAt', 'updatedAt'],
        });

        const profile = user ? await this.profileRepository.findOne({ where: { userId: id } }) : null;
        const companies = user ? await this.userCompanyRepository.find({ where: { userId: id }, relations: ['company'] }) : [];

        return { user, profile, companies };
    }

    static async findByEmail(email: string): Promise<User | null> {
        return this.repository.findOne({ where: { email } });
    }

    static async findAllActive(): Promise<User[]> {
        return this.repository.find({
            where: { status: 'active' as User['status'] },
            select: ['id', 'name', 'email'],
        });
    }

    static async findGlobalRoles(): Promise<Role[]> {
        const roleRepository = AppDataSource.getRepository(Role);
        return roleRepository.find({
            where: { companyId: IsNull() },
            select: ['id', 'name'],
        });
    }
}

