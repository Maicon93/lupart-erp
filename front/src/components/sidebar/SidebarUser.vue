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
    name: 'SidebarUser',

    data() {
        return {
            menu: [
                {
                    label: 'sidebar.user.sections.GENERAL',
                    items: [
                        { icon: 'dashboard', label: 'sidebar.user.items.DASHBOARD', to: '/dashboard', disabled: true },
                        { icon: 'person', label: 'sidebar.user.items.MY_PROFILE', to: '/profile', disabled: true },
                    ],
                },
                {
                    label: 'sidebar.user.sections.REGISTRATIONS',
                    items: [
                        { icon: 'people', label: 'sidebar.user.items.CUSTOMERS', to: '/customers', disabled: false },
                        { icon: 'local_shipping', label: 'sidebar.user.items.SUPPLIERS', to: '/suppliers', disabled: true },
                        { icon: 'inventory_2', label: 'sidebar.user.items.PRODUCTS', to: '/products', disabled: true },
                        { icon: 'category', label: 'sidebar.user.items.CATEGORIES', to: '/categories', disabled: true },
                        { icon: 'straighten', label: 'sidebar.user.items.MEASUREMENT_UNITS', to: '/measurement-units', disabled: false },
                        { icon: 'payment', label: 'sidebar.user.items.PAYMENT_TYPES', to: '/payment-types', disabled: true },
                    ],
                },
                {
                    label: 'sidebar.user.sections.STOCK_CONTROL',
                    items: [
                        { icon: 'add_box', label: 'sidebar.user.items.STOCK_ENTRY', to: '/stock-entries', disabled: true },
                        { icon: 'tune', label: 'sidebar.user.items.STOCK_ADJUSTMENT', to: '/stock-adjustments', disabled: true },
                        { icon: 'fact_check', label: 'sidebar.user.items.INVENTORY', to: '/inventories', disabled: true },
                    ],
                },
                {
                    label: 'sidebar.user.sections.TRANSACTIONS',
                    items: [
                        { icon: 'point_of_sale', label: 'sidebar.user.items.DIRECT_SALE', to: '/direct-sale', disabled: true },
                        { icon: 'receipt_long', label: 'sidebar.user.items.SALES', to: '/sales', disabled: true },
                        { icon: 'description', label: 'sidebar.user.items.QUOTES', to: '/quotes', disabled: true },
                        { icon: 'build', label: 'sidebar.user.items.SERVICE_ORDERS', to: '/service-orders', disabled: true },
                    ],
                },
                {
                    label: 'sidebar.user.sections.FINANCIAL',
                    items: [
                        { icon: 'arrow_downward', label: 'sidebar.user.items.ACCOUNTS_RECEIVABLE', to: '/accounts-receivable', disabled: true },
                        { icon: 'arrow_upward', label: 'sidebar.user.items.ACCOUNTS_PAYABLE', to: '/accounts-payable', disabled: true },
                        { icon: 'trending_up', label: 'sidebar.user.items.CASH_FLOW', to: '/cash-flow', disabled: true },
                        { icon: 'account_balance_wallet', label: 'sidebar.user.items.CASH_MOVEMENTS', to: '/cash-movements', disabled: true },
                    ],
                },
                {
                    label: 'sidebar.user.sections.REPORTS',
                    items: [
                        { icon: 'history', label: 'sidebar.user.items.MOVEMENT_HISTORY', to: '/reports/movements', disabled: true },
                        { icon: 'bar_chart', label: 'sidebar.user.items.SALES_BY_PERIOD', to: '/reports/sales-period', disabled: true },
                        { icon: 'star', label: 'sidebar.user.items.TOP_SELLING_PRODUCTS', to: '/reports/top-products', disabled: true },
                        { icon: 'warning', label: 'sidebar.user.items.MINIMUM_STOCK', to: '/reports/minimum-stock', disabled: true },
                    ],
                },
                {
                    label: 'sidebar.user.sections.SETTINGS',
                    items: [
                        { icon: 'settings', label: 'sidebar.user.items.COMPANY_SETTINGS', to: '/company-settings', disabled: true },
                        { icon: 'card_membership', label: 'sidebar.user.items.MY_PLAN', to: '/my-plan', disabled: true },
                        { icon: 'group', label: 'sidebar.user.items.USERS', to: '/users', disabled: true },
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
