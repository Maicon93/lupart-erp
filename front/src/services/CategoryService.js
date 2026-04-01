import { $api } from '../plugins/axios';

const CategoryService = {
    findAll(params) {
        return $api.get('/categories', { params });
    },

    findById(id) {
        return $api.get(`/categories/${id}`);
    },

    create(data) {
        return $api.post('/categories', data);
    },

    update(id, data) {
        return $api.put(`/categories/${id}`, data);
    },

    toggleStatus(id) {
        return $api.patch(`/categories/${id}/toggle-status`);
    },

    remove(id) {
        return $api.delete(`/categories/${id}`);
    },
};

export default CategoryService;
