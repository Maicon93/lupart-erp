import { $api } from '../plugins/axios';

const SaleService = {
    findAll(params) {
        return $api.get('/sales', { params });
    },

    findById(id) {
        return $api.get(`/sales/${id}`);
    },

    findPayment(id) {
        return $api.get(`/sales/${id}/payment`);
    },

    create(data) {
        return $api.post('/sales', data);
    },

    cancel(id, data) {
        return $api.post(`/sales/${id}/cancel`, data);
    },
};

export default SaleService;
