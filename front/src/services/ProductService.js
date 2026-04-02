import { $api } from '../plugins/axios';

const ProductService = {
    findAll(params) {
        return $api.get('/products', { params });
    },

    findById(id) {
        return $api.get(`/products/${id}`);
    },

    create(data) {
        return $api.post('/products', data);
    },

    update(id, data) {
        return $api.put(`/products/${id}`, data);
    },

    toggleStatus(id) {
        return $api.patch(`/products/${id}/toggle-status`);
    },
};

export default ProductService;
