import { $api } from '../plugins/axios';

const UserService = {
    findAll(params) {
        return $api.get('/users', { params });
    },

    findById(id) {
        return $api.get(`/users/${id}`);
    },

    findAllActive() {
        return $api.get('/users/active');
    },

    findGlobalRoles() {
        return $api.get('/users/roles');
    },

    create(data) {
        return $api.post('/users', data);
    },

    update(id, data) {
        return $api.put(`/users/${id}`, data);
    },

    toggleStatus(id) {
        return $api.patch(`/users/${id}/toggle-status`);
    },
};

export default UserService;
