import { $api } from '../plugins/axios';

const CompanySettingService = {
    findSettings() {
        return $api.get('/company-settings');
    },

    updateSettings(data) {
        return $api.put('/company-settings', data);
    },

    uploadLogo(formData) {
        return $api.post('/company-settings/logo', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
    },

    removeLogo() {
        return $api.delete('/company-settings/logo');
    },
};

export default CompanySettingService;
