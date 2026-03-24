import { $api } from '../plugins/axios';

const PositionService = {
    findAll(params) {
        return $api.get('/positions', { params });
    },

    findById(id) {
        return $api.get(`/positions/${id}`);
    },

    create(data) {
        return $api.post('/positions', data);
    },

    update(id, data) {
        return $api.put(`/positions/${id}`, data);
    },

    remove(id) {
        return $api.delete(`/positions/${id}`);
    },
};

export default PositionService;
