import { $api } from '../plugins/axios';

const SupplierService = {
    findAll(params) {
        return $api.get('/suppliers', { params });
    },

    findById(id) {
        return $api.get(`/suppliers/${id}`);
    },

    create(data) {
        return $api.post('/suppliers', data);
    },

    update(id, data) {
        return $api.put(`/suppliers/${id}`, data);
    },

    remove(id) {
        return $api.delete(`/suppliers/${id}`);
    },
};

export default SupplierService;
