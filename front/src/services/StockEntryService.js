import { $api } from '../plugins/axios';

const StockEntryService = {
    findAll(params) {
        return $api.get('/stock-entries', { params });
    },

    findById(id) {
        return $api.get(`/stock-entries/${id}`);
    },

    create(data) {
        return $api.post('/stock-entries', data);
    },
};

export default StockEntryService;
