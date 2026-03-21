import { defineStore } from 'pinia';

export const useEnterpriseStore = defineStore('enterprise', {
    state: () => ({
        company: null,
    }),

    getters: {
        companyId: (state) => state.company?.id ?? null,
    },

    actions: {
        setCompany(company) {
            this.company = company;
        },

        clearCompany() {
            this.company = null;
        },
    },

    persist: true,
});
