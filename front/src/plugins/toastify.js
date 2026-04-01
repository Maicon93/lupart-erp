import Vue3Toastify from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';
import { useThemeStore } from '../stores/theme';

const getToastTheme = () => {
    return useThemeStore().dark ? 'dark' : 'light';
};

export const toastifyPlugin = {
    install(app) {
        app.use(Vue3Toastify, {
            autoClose: 3000,
            position: 'top-right',
            theme: 'light',
        });
    },
};

export { getToastTheme };
