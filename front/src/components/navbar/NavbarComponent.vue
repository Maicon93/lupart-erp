<template>
    <q-header class="navbar">
        <q-toolbar class="navbar__toolbar">
            <q-btn flat dense round icon="menu" class="lt-md" @click="$emit('toggle-sidebar')" />

            <div class="navbar__left">
                <div class="row items-center q-gutter-xs">
                    <q-icon name="business" size="20px" color="primary" />
                    <span class="navbar__company-name text-weight-bold">
                        {{ companyName }}
                    </span>
                </div>
                <div class="row items-center q-gutter-xs">
                    <q-icon name="account_circle" size="16px" class="navbar__user-icon" />
                    <span class="navbar__user-name text-caption">
                        {{ userName }}
                    </span>
                </div>
            </div>

            <q-space />

            <q-btn
                v-if="isAdmin"
                flat
                no-caps
                dense
                class="navbar__panel-toggle q-mr-sm"
                @click="$emit('switch-panel', activePanel === 'admin' ? 'user' : 'admin')"
            >
                <q-icon
                    :name="activePanel === 'admin' ? 'admin_panel_settings' : 'storefront'"
                    size="18px"
                    class="q-mr-xs"
                />
                <span class="text-caption">
                    {{ activePanel === 'admin' ? $t('navbar.ADMIN_PANEL') : $t('navbar.USER_PANEL') }}
                </span>
            </q-btn>

            <q-btn
                flat
                round
                :icon="themeStore.dark ? 'light_mode' : 'dark_mode'"
                class="navbar__action-button"
                @click="themeStore.toggleDark()"
            >
                <q-tooltip>{{ themeStore.dark ? $t('navbar.LIGHT_MODE') : $t('navbar.DARK_MODE') }}</q-tooltip>
            </q-btn>

            <q-btn flat round icon="notifications_none" class="navbar__action-button navbar__action-button--disabled">
                <q-tooltip>{{ $t('navbar.NOTIFICATIONS') }}</q-tooltip>
            </q-btn>

            <q-btn flat round icon="logout" class="navbar__action-button" @click="$emit('logout')">
                <q-tooltip>{{ $t('common.actions.LOGOUT') }}</q-tooltip>
            </q-btn>
        </q-toolbar>
    </q-header>
</template>

<script>
import { useAuthStore } from '../../stores/auth';
import { useEnterpriseStore } from '../../stores/enterprise';
import { useThemeStore } from '../../stores/theme';

export default {
    name: 'NavbarComponent',

    emits: ['toggle-sidebar', 'logout', 'switch-panel'],

    props: {
        activePanel: {
            type: String,
            default: 'user',
        },
    },

    data() {
        return {
            authStore: useAuthStore(),
            enterpriseStore: useEnterpriseStore(),
            themeStore: useThemeStore(),
        };
    },

    computed: {
        companyName() {
            return this.enterpriseStore.company?.name || this.$t('navbar.ADMIN_LABEL');
        },

        userName() {
            return this.authStore.user?.name || '';
        },

        isAdmin() {
            return this.authStore.role === 'admin';
        },
    },
};
</script>

<style scoped>
.navbar {
    background-color: var(--bg-header);
    color: var(--text-primary);
    border-bottom: 1px solid var(--border-color);
}

.navbar__toolbar {
    min-height: 72px;
    padding: 0 20px;
}

.navbar__left {
    display: flex;
    flex-direction: column;
    gap: 2px;
    margin-left: 8px;
}

.navbar__company-name {
    font-size: 14px;
    color: var(--text-primary);
}

.navbar__user-icon {
    color: var(--text-secondary);
}

.navbar__user-name {
    color: var(--text-secondary);
}

.navbar__action-button {
    color: var(--text-secondary);
}

.navbar__panel-toggle {
    color: var(--text-secondary);
    border: 1px solid var(--border-color);
    border-radius: 6px;
    padding: 4px 10px;
}
</style>
