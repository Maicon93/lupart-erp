import { AppDataSource } from '../config/database';
import { Permission } from '../models/Permission';
import { RolePermission } from '../models/RolePermission';
import { UserRole } from '../models/UserRole';

export default class PermissionRepository {
    private static repository = AppDataSource.getRepository(Permission);
    private static rolePermissionRepository = AppDataSource.getRepository(RolePermission);

    static async findAll(filter?: string, page = 1, limit = 20) {
        const query = this.repository.createQueryBuilder('permission');

        if (filter) {
            query.where(
                'LOWER(permission.name) LIKE :filter OR LOWER(permission.observation) LIKE :filter',
                { filter: `%${filter.toLowerCase()}%` },
            );
        }

        query.orderBy('permission.name', 'ASC');
        query.skip((page - 1) * limit).take(limit);

        const [data, total] = await query.getManyAndCount();

        return { data, total };
    }

    static async hasPermission(userId: number, permission: string): Promise<boolean> {
        const count = await this.rolePermissionRepository
            .createQueryBuilder('rolePermission')
            .innerJoin(UserRole, 'userRole', 'userRole.role_id = rolePermission.role_id')
            .innerJoin(Permission, 'permission', 'permission.id = rolePermission.permission_id')
            .where('userRole.user_id = :userId', { userId })
            .andWhere('permission.name = :permission', { permission })
            .getCount();

        return count > 0;
    }
}

