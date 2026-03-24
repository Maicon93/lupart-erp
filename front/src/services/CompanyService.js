import { $api } from '../plugins/axios';

const CompanyService = {
    findAll(params) {
        return $api.get('/companies', { params });
    },

    findById(id) {
        return $api.get(`/companies/${id}`);
    },

    findAllActive() {
        return $api.get('/companies/active');
    },

    create(data) {
        return $api.post('/companies', data);
    },

    update(id, data) {
        return $api.put(`/companies/${id}`, data);
    },

    toggleStatus(id) {
        return $api.patch(`/companies/${id}/toggle-status`);
    },

    findBranches(id) {
        return $api.get(`/companies/${id}/branches`);
    },
};

export default CompanyService;
