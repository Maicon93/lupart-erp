import { $api } from '../plugins/axios';

const MeasurementUnitService = {
    findAll(params) {
        return $api.get('/measurement-units', { params });
    },

    findById(id) {
        return $api.get(`/measurement-units/${id}`);
    },

    create(data) {
        return $api.post('/measurement-units', data);
    },

    update(id, data) {
        return $api.put(`/measurement-units/${id}`, data);
    },

    toggleStatus(id) {
        return $api.patch(`/measurement-units/${id}/toggle-status`);
    },
};

export default MeasurementUnitService;
