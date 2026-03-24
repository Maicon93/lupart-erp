import { AppDataSource } from '../config/database';
import { Role } from '../models/Role';
import { RolePermission } from '../models/RolePermission';
import PositionRepository from '../repositories/PositionRepository';
import messageCodes from '../i18n/MessageCodes';

interface IPositionInput {
    name: string;
    permissions: number[];
}

const findAll = async (search?: string, page = 1, limit = 20): Promise<{ data: Role[]; total: number }> => {
    return PositionRepository.findAll(search, page, limit);
};

const findById = async (id: number): Promise<Role> => {
    const position = await PositionRepository.findByIdWithPermissions(id);

    if (!position) {
        throw { status: 404, messageCode: messageCodes.common.messages.NOT_FOUND };
    }

    return position;
};

const create = async (input: IPositionInput, userId: number): Promise<Role> => {
    return AppDataSource.transaction(async (manager) => {
        const entity = manager.create(Role, {
            name: input.name,
            companyId: undefined,
            createdBy: userId,
        });

        const position = await manager.save(entity);

        const rolePermissions = input.permissions.map((permissionId) =>
            manager.create(RolePermission, {
                roleId: position.id,
                permissionId,
                createdBy: userId,
            }),
        );

        await manager.save(rolePermissions);

        return position;
    });
};

const update = async (id: number, input: IPositionInput, userId: number): Promise<Role> => {
    const position = await findById(id);

    if (!position.companyId && (position.name === 'admin' || position.name === 'user')) {
        throw { status: 400, messageCode: messageCodes.positions.errors.CANNOT_EDIT_GLOBAL };
    }

    return AppDataSource.transaction(async (manager) => {
        await manager.update(Role, position.id, {
            name: input.name,
        });

        await manager.delete(RolePermission, { roleId: position.id });

        const rolePermissions = input.permissions.map((permissionId) =>
            manager.create(RolePermission, {
                roleId: position.id,
                permissionId,
                createdBy: userId,
            }),
        );

        await manager.save(rolePermissions);

        return manager.findOneByOrFail(Role, { id: position.id });
    });
};

const remove = async (id: number): Promise<void> => {
    const position = await findById(id);

    if (!position.companyId && (position.name === 'admin' || position.name === 'user')) {
        throw { status: 400, messageCode: messageCodes.positions.errors.CANNOT_DELETE_GLOBAL };
    }

    const linkedUsers = await PositionRepository.countLinkedUsers(id);

    if (linkedUsers > 0) {
        throw { status: 400, messageCode: messageCodes.positions.errors.HAS_LINKED_USERS };
    }

    await AppDataSource.transaction(async (manager) => {
        await manager.delete(RolePermission, { roleId: position.id });
        await manager.delete(Role, { id: position.id });
    });
};

export default { findAll, findById, create, update, remove };
