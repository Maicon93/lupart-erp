import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: null,
        token: null,
        role: null,
    }),

    getters: {
        isAuthenticated: (state) => !!state.token,
    },

    actions: {
        setAuth(user, token, role) {
            this.user = user;
            this.token = token;
            this.role = role;
        },

        clearAuth() {
            this.user = null;
            this.token = null;
            this.role = null;
        },
    },

    persist: true,
});
