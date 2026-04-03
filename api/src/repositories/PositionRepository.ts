import { AppDataSource } from '../config/database';
import { Role } from '../models/Role';
import { RolePermission } from '../models/RolePermission';
import { UserRole } from '../models/UserRole';

export default class PositionRepository {
    private repository = AppDataSource.getRepository(Role);
    private rolePermissionRepository = AppDataSource.getRepository(RolePermission);
    private userRoleRepository = AppDataSource.getRepository(UserRole);

    async findAll(search?: string, page = 1, limit = 20): Promise<{ data: Role[]; total: number }> {
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

    async findById(id: number): Promise<Role | null> {
        return this.repository.findOne({ where: { id } });
    }

    async findByIdWithPermissions(id: number): Promise<Role | null> {
        return this.repository
            .createQueryBuilder('role')
            .leftJoinAndSelect('role.rolePermissions', 'rolePermissions')
            .leftJoinAndSelect('rolePermissions.permission', 'permission')
            .where('role.id = :id', { id })
            .getOne();
    }

    async findByName(name: string): Promise<Role | null> {
        return this.repository.findOne({ where: { name } });
    }

    async findPermissionsByRoleId(roleId: number): Promise<RolePermission[]> {
        return this.rolePermissionRepository.find({
            where: { roleId },
            relations: ['permission'],
        });
    }

    async countLinkedUsers(roleId: number): Promise<number> {
        return this.userRoleRepository.count({ where: { roleId } });
    }
}

