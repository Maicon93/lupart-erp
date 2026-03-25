import { $api } from '../plugins/axios';

const PermissionService = {
    findAll(params) {
        return $api.get('/permissions', { params });
    },
};

export default PermissionService;
