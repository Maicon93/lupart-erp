import { AppDataSource } from '../config/database';
import { Role } from '../models/Role';
import { RolePermission } from '../models/RolePermission';
import { UserRole } from '../models/UserRole';

const repository = AppDataSource.getRepository(Role);
const rolePermissionRepository = AppDataSource.getRepository(RolePermission);
const userRoleRepository = AppDataSource.getRepository(UserRole);

const findAll = async (search?: string, page = 1, limit = 20): Promise<{ data: Role[]; total: number }> => {
    const query = repository
        .createQueryBuilder('role')
        .loadRelationCountAndMap('role.permissionCount', 'role.rolePermissions');

    if (search) {
        query.where('role.name ILIKE :search', { search: `%${search}%` });
    }

    query.orderBy('role.id', 'ASC');
    query.skip((page - 1) * limit).take(limit);

    const [data, total] = await query.getManyAndCount();
    return { data, total };
};

const findById = async (id: number): Promise<Role | null> => {
    return repository.findOne({ where: { id } });
};

const findByIdWithPermissions = async (id: number): Promise<Role | null> => {
    return repository
        .createQueryBuilder('role')
        .leftJoinAndSelect('role.rolePermissions', 'rolePermissions')
        .leftJoinAndSelect('rolePermissions.permission', 'permission')
        .where('role.id = :id', { id })
        .getOne();
};

const findByName = async (name: string): Promise<Role | null> => {
    return repository.findOne({ where: { name } });
};

const findPermissionsByRoleId = async (roleId: number): Promise<RolePermission[]> => {
    return rolePermissionRepository.find({
        where: { roleId },
        relations: ['permission'],
    });
};

const countLinkedUsers = async (roleId: number): Promise<number> => {
    return userRoleRepository.count({ where: { roleId } });
};

export default { findAll, findById, findByIdWithPermissions, findByName, findPermissionsByRoleId, countLinkedUsers };
