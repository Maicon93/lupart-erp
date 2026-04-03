import { defineStore } from 'pinia';
import { useAuthStore } from './auth';
import AuthService from '../services/AuthService';

export const useThemeStore = defineStore('theme', {
    state: () => ({
        dark: false,
    }),

    actions: {
        async toggleDark() {
            const newValue = !this.dark;

            try {
                await AuthService.updatePreferences({ theme: newValue ? 'dark' : 'light' });
                this.dark = newValue;

                const authStore = useAuthStore();
                if (authStore.user) {
                    authStore.user.theme = newValue ? 'dark' : 'light';
                }
            } catch {
                // Handled by axios interceptor
            }
        },

        setDark(value) {
            this.dark = value;
        },
    },
});
