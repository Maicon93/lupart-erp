import PermissionRepository from '../repositories/PermissionRepository';

export default class PermissionService {
    static async findAll(filter?: string, page?: number, limit?: number) {
        return PermissionRepository.findAll(filter, page, limit);
    }

    static async checkPermission(userId: number, userRole: string, permission: string): Promise<boolean> {
        // Admin tem acesso total a todas as telas
        if (userRole === 'admin') {
            return true;
        }

        // Para usuários comuns, verificar via role_permissions
        return PermissionRepository.hasPermission(userId, permission);
    }
}

