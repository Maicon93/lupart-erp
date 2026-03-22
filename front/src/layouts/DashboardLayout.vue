<template>
    <q-layout view="lHh Lpr lff" :class="{ 'dark-mode': themeStore.dark }">
        <NavbarComponent
            :active-panel="activePanel"
            @toggle-sidebar="sidebarOpen = !sidebarOpen"
            @logout="handleLogout"
            @switch-panel="switchPanel"
        />

        <q-drawer
            v-model="sidebarOpen"
            :width="250"
            :breakpoint="1024"
            bordered
            class="dashboard-layout__sidebar"
        >
            <div class="column fit">
                <q-scroll-area class="col">
                    <SidebarAdmin v-if="activePanel === 'admin'" />
                    <SidebarUser v-else />
                </q-scroll-area>

                <div class="dashboard-layout__sidebar-footer text-caption text-center">
                    v1.0.0
                </div>
            </div>
        </q-drawer>

        <q-page-container>
            <q-page class="dashboard-layout__page">
                <router-view />
            </q-page>
        </q-page-container>

        <q-btn
            v-if="isAdmin && activePanel === 'user'"
            fab
            icon="admin_panel_settings"
            color="primary"
            class="dashboard-layout__admin-button"
            @click="switchPanel('admin')"
        >
            <q-tooltip>{{ $t('navbar.BACK_TO_ADMIN') }}</q-tooltip>
        </q-btn>
    </q-layout>
</template>

<script>
import { useThemeStore } from '../stores/theme';
import { useAuthStore } from '../stores/auth';
import { useEnterpriseStore } from '../stores/enterprise';
import NavbarComponent from '../components/navbar/NavbarComponent.vue';
import SidebarAdmin from '../components/sidebar/SidebarAdmin.vue';
import SidebarUser from '../components/sidebar/SidebarUser.vue';

export default {
    name: 'DashboardLayout',

    components: {
        NavbarComponent,
        SidebarAdmin,
        SidebarUser,
    },

    data() {
        return {
            themeStore: useThemeStore(),
            authStore: useAuthStore(),
            sidebarOpen: true,
            activePanel: null,
        };
    },

    computed: {
        isAdmin() {
            return this.authStore.role === 'admin';
        },
    },

    created() {
        this.activePanel = this.isAdmin ? 'admin' : 'user';
    },

    watch: {
        'themeStore.dark': {
            immediate: true,
            handler(isDark) {
                this.$q.dark.set(isDark);
            },
        },
    },

    methods: {
        switchPanel(panel) {
            this.activePanel = panel;
        },

        handleLogout() {
            const enterpriseStore = useEnterpriseStore();

            this.authStore.clearAuth();
            enterpriseStore.clearCompany();
            localStorage.removeItem('token');

            this.$router.push({ name: 'login' });
        },
    },
};
</script>

<style scoped>
.dashboard-layout__sidebar {
    background-color: var(--bg-sidebar);
    border-color: var(--border-color);
}

.dashboard-layout__sidebar-footer {
    padding: 12px;
    color: var(--text-secondary);
    border-top: 1px solid var(--border-color);
}

.dashboard-layout__page {
    background-color: var(--bg-page);
}

.dashboard-layout__admin-button {
    position: fixed;
    bottom: 24px;
    right: 24px;
    z-index: 1000;
}
</style>
