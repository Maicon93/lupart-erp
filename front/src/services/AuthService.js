import { $api } from '../plugins/axios';

const AuthService = {
    login(credentials) {
        return $api.post('/auth/login', credentials, {
            withCredentials: true,
        });
    },
};

export default AuthService;
