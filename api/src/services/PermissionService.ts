import permissionRepository from '../repositories/PermissionRepository';

const findAll = async (filter?: string, page?: number, limit?: number) => {
    return permissionRepository.findAll(filter, page, limit);
};

const checkPermission = async (userId: number, userRole: string, screen: number): Promise<boolean> => {
    // Admin tem acesso total ao painel admin (telas 10-99)
    if (userRole === 'admin' && screen >= 10 && screen <= 99) {
        return true;
    }

    // Para demais casos, verificar via role_permissions
    return permissionRepository.hasPermissionForScreen(userId, screen);
};

export default { findAll, checkPermission };
