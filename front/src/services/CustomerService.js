import { $api } from '../plugins/axios';

const CustomerService = {
    findAll(params) {
        return $api.get('/customers', { params });
    },

    findById(id) {
        return $api.get(`/customers/${id}`);
    },

    create(data) {
        return $api.post('/customers', data);
    },

    update(id, data) {
        return $api.put(`/customers/${id}`, data);
    },

    remove(id) {
        return $api.delete(`/customers/${id}`);
    },
};

export default CustomerService;
