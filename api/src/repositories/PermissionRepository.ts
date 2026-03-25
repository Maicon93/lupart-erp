import { AppDataSource } from '../config/database';
import { Permission } from '../models/Permission';
import { RolePermission } from '../models/RolePermission';
import { UserRole } from '../models/UserRole';

const repository = AppDataSource.getRepository(Permission);
const rolePermissionRepository = AppDataSource.getRepository(RolePermission);
const userRoleRepository = AppDataSource.getRepository(UserRole);

const findAll = async (filter?: string, page = 1, limit = 20) => {
    const query = repository.createQueryBuilder('permission');

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
};

const hasPermissionForScreen = async (userId: number, screen: number): Promise<boolean> => {
    const count = await rolePermissionRepository
        .createQueryBuilder('rolePermission')
        .innerJoin(UserRole, 'userRole', 'userRole.role_id = rolePermission.role_id')
        .innerJoin(Permission, 'permission', 'permission.id = rolePermission.permission_id')
        .where('userRole.user_id = :userId', { userId })
        .andWhere('permission.name LIKE :screen', { screen: `${screen}_%` })
        .getCount();

    return count > 0;
};

export default { findAll, hasPermissionForScreen };
