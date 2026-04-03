import PermissionRepository from '../repositories/PermissionRepository';

export default class PermissionService {
    private permissionRepository = new PermissionRepository();

    async findAll(filter?: string, page?: number, limit?: number) {
        return this.permissionRepository.findAll(filter, page, limit);
    }

    async checkPermission(userId: number, userRole: string, permission: string): Promise<boolean> {
        // Admin tem acesso total a todas as telas
        if (userRole === 'admin') {
            return true;
        }

        // Para usuários comuns, verificar via role_permissions
        return this.permissionRepository.hasPermission(userId, permission);
    }
}

