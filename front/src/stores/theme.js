import { defineStore } from 'pinia';

export const useThemeStore = defineStore('theme', {
    state: () => ({
        dark: false,
    }),

    actions: {
        toggleDark() {
            this.dark = !this.dark;
        },

        setDark(value) {
            this.dark = value;
        },
    },

    persist: true,
});
