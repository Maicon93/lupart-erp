<template>
    <q-list padding>
        <q-expansion-item
            v-for="section in menu"
            :key="section.label"
            :label="$t(section.label)"
            default-opened
            dense
            switch-toggle-side
            header-class="sidebar__section-header"
        >
            <q-item
                v-for="item in section.items"
                :key="item.label"
                :clickable="!item.disabled"
                dense
                class="sidebar__item items-center"
                :class="{ 'sidebar__item--disabled': item.disabled }"
                :to="item.disabled ? undefined : item.to"
                active-class="sidebar__item--active"
            >
                <q-icon :name="item.icon" size="20px" class="q-mr-sm" />
                <q-item-section>
                    <q-item-label>{{ $t(item.label) }}</q-item-label>
                </q-item-section>
            </q-item>
        </q-expansion-item>
    </q-list>
</template>

<script>
export default {
    name: 'SidebarAdmin',

    data() {
        return {
            menu: [
                {
                    label: 'sidebar.admin.sections.REGISTRATIONS',
                    items: [
                        { icon: 'business', label: 'sidebar.admin.items.COMPANIES', to: '/admin/companies', disabled: false },
                        { icon: 'account_tree', label: 'sidebar.admin.items.BRANCHES', to: '/admin/branches', disabled: true },
                        { icon: 'people', label: 'sidebar.admin.items.USERS', to: '/admin/users', disabled: false },
                        { icon: 'badge', label: 'sidebar.admin.items.ROLES', to: '/admin/roles', disabled: true },
                        { icon: 'lock', label: 'sidebar.admin.items.PERMISSIONS', to: '/admin/permissions', disabled: true },
                    ],
                },
                {
                    label: 'sidebar.admin.sections.ACCESS_PLANS',
                    items: [
                        { icon: 'card_membership', label: 'sidebar.admin.items.PLANS', to: '/admin/access-plans', disabled: false },
                    ],
                },
                {
                    label: 'sidebar.admin.sections.SETTINGS',
                    items: [
                        { icon: 'settings', label: 'sidebar.admin.items.SYSTEM_PARAMETERS', to: '/admin/settings', disabled: true },
                    ],
                },
                {
                    label: 'sidebar.admin.sections.REPORTS',
                    items: [
                        { icon: 'assessment', label: 'sidebar.admin.items.COMPANIES_AND_PLANS', to: '/admin/reports/companies-plans', disabled: true },
                        { icon: 'warning', label: 'sidebar.admin.items.DEFAULTING_COMPANIES', to: '/admin/reports/defaulting', disabled: true },
                        { icon: 'group', label: 'sidebar.admin.items.USERS_BY_COMPANY', to: '/admin/reports/users-by-company', disabled: true },
                    ],
                },
                {
                    label: 'sidebar.admin.sections.MONITORING',
                    items: [
                        { icon: 'history', label: 'sidebar.admin.items.AUDIT_LOGS', to: '/admin/logs', disabled: true },
                    ],
                },
            ],
        };
    },
};
</script>

<style>
.sidebar__section-header {
    font-size: 11px !important;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    color: var(--text-secondary) !important;
    font-weight: 500;
    min-height: 36px !important;
    padding: 0 16px 0 8px !important;
}

.sidebar__section-header .q-item__section--side {
    padding-right: 0;
    min-width: unset;
}
</style>

<style scoped>
.sidebar__item {
    border-radius: 8px;
    margin: 0 8px;
    min-height: 36px;
    padding-left: 24px;
    color: var(--text-primary);
}

.sidebar__item--active {
    background-color: rgba(25, 118, 210, 0.1);
    color: var(--q-primary);
}

.sidebar__item--disabled {
    opacity: 0.4;
    cursor: default;
    pointer-events: none;
}
</style>
