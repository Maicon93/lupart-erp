import { AppDataSource } from '../config/database';
import { Role } from '../models/Role';
import { RolePermission } from '../models/RolePermission';
import { UserRole } from '../models/UserRole';

export default class PositionRepository {
    private static repository = AppDataSource.getRepository(Role);
    private static rolePermissionRepository = AppDataSource.getRepository(RolePermission);
    private static userRoleRepository = AppDataSource.getRepository(UserRole);

    static async findAll(search?: string, page = 1, limit = 20): Promise<{ data: Role[]; total: number }> {
        const query = this.repository
            .createQueryBuilder('role')
            .loadRelationCountAndMap('role.permissionCount', 'role.rolePermissions');

        if (search) {
            query.where('role.name ILIKE :search', { search: `%${search}%` });
        }

        query.orderBy('role.id', 'ASC');
        query.skip((page - 1) * limit).take(limit);

        const [data, total] = await query.getManyAndCount();
        return { data, total };
    }

    static async findById(id: number): Promise<Role | null> {
        return this.repository.findOne({ where: { id } });
    }

    static async findByIdWithPermissions(id: number): Promise<Role | null> {
        return this.repository
            .createQueryBuilder('role')
            .leftJoinAndSelect('role.rolePermissions', 'rolePermissions')
            .leftJoinAndSelect('rolePermissions.permission', 'permission')
            .where('role.id = :id', { id })
            .getOne();
    }

    static async findByName(name: string): Promise<Role | null> {
        return this.repository.findOne({ where: { name } });
    }

    static async findPermissionsByRoleId(roleId: number): Promise<RolePermission[]> {
        return this.rolePermissionRepository.find({
            where: { roleId },
            relations: ['permission'],
        });
    }

    static async countLinkedUsers(roleId: number): Promise<number> {
        return this.userRoleRepository.count({ where: { roleId } });
    }
}

