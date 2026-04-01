import permissionRepository from '../repositories/PermissionRepository';

const findAll = async (filter?: string, page?: number, limit?: number) => {
    return permissionRepository.findAll(filter, page, limit);
};

const checkPermission = async (userId: number, userRole: string, screen: number): Promise<boolean> => {
    // Admin tem acesso total a todas as telas
    if (userRole === 'admin') {
        return true;
    }

    // Para usuários comuns, verificar via role_permissions
    return permissionRepository.hasPermissionForScreen(userId, screen);
};

export default { findAll, checkPermission };
