import { $api } from '../plugins/axios';

const AuthService = {
    login(credentials) {
        return $api.post('/auth/login', credentials, {
            withCredentials: true,
        });
    },

    updatePreferences(preferences) {
        return $api.patch('/auth/preferences', preferences);
    },
};

export default AuthService;
