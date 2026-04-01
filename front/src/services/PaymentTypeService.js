import { $api } from '../plugins/axios';

const PaymentTypeService = {
    findAll(params) {
        return $api.get('/payment-types', { params });
    },

    findById(id) {
        return $api.get(`/payment-types/${id}`);
    },

    create(data) {
        return $api.post('/payment-types', data);
    },

    update(id, data) {
        return $api.put(`/payment-types/${id}`, data);
    },

    toggleStatus(id) {
        return $api.patch(`/payment-types/${id}/toggle-status`);
    },
};

export default PaymentTypeService;
