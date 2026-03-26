import { $api } from '../plugins/axios';

const SystemConfigurationService = {
    findAll() {
        return $api.get('/system-configurations');
    },

    updateTokens(data) {
        return $api.put('/system-configurations/tokens', data);
    },

    updateUpload(data) {
        return $api.put('/system-configurations/upload', data);
    },
};

export default SystemConfigurationService;
