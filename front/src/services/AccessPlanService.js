import { $api } from '../plugins/axios';

const AccessPlanService = {
    findAll(params) {
        return $api.get('/access-plans', { params });
    },

    findById(id) {
        return $api.get(`/access-plans/${id}`);
    },

    create(data) {
        return $api.post('/access-plans', data);
    },

    update(id, data) {
        return $api.put(`/access-plans/${id}`, data);
    },

    toggleStatus(id) {
        return $api.patch(`/access-plans/${id}/toggle-status`);
    },

    remove(id) {
        return $api.delete(`/access-plans/${id}`);
    },
};

export default AccessPlanService;
