const routes = [
    {
        path: '/login',
        component: () => import('../layouts/AuthLayout.vue'),
        children: [
            {
                path: '',
                name: 'login',
                component: () => import('../views/login/LoginView.vue'),
            },
        ],
    },
    {
        path: '/',
        component: () => import('../layouts/DashboardLayout.vue'),
        children: [
            {
                path: '',
                name: 'home',
                component: () => import('../views/home/HomeView.vue'),
            },
            // Admin routes
            {
                path: 'admin/access-plans',
                name: 'admin-access-plans',
                component: () => import('../views/admin/access-plans/AccessPlanList.vue'),
                meta: { permission: '10_access_plans', panel: 'admin' },
            },
            {
                path: 'admin/companies',
                name: 'admin-companies',
                component: () => import('../views/admin/companies/CompanyList.vue'),
                meta: { permission: '12_companies', panel: 'admin' },
            },
            {
                path: 'admin/users',
                name: 'admin-users',
                component: () => import('../views/admin/users/UserList.vue'),
                meta: { permission: '11_users', panel: 'admin' },
            },
            {
                path: 'admin/positions',
                name: 'admin-positions',
                component: () => import('../views/admin/positions/PositionList.vue'),
                meta: { permission: '13_positions', panel: 'admin' },
            },
            {
                path: 'admin/system-parameters',
                name: 'admin-system-parameters',
                component: () => import('../views/admin/system-parameters/SystemParameterList.vue'),
                meta: { permission: '15_system_parameters', panel: 'admin' },
            },
            {
                path: 'admin/permissions',
                name: 'admin-permissions',
                component: () => import('../views/admin/permissions/PermissionList.vue'),
                meta: { permission: '14_permissions', panel: 'admin' },
            },
            // User routes
            {
                path: 'products',
                name: 'products',
                component: () => import('../views/user/products/ProductList.vue'),
                meta: { permission: '107_products', panel: 'user', screen: 107 },
            },
            {
                path: 'measurement-units',
                name: 'measurement-units',
                component: () => import('../views/user/measurement-units/MeasurementUnitList.vue'),
                meta: { permission: '104_measurement_units', panel: 'user', screen: 104 },
            },
            {
                path: 'customers',
                name: 'customers',
                component: () => import('../views/user/customers/CustomerList.vue'),
                meta: { permission: '105_customers', panel: 'user', screen: 105 },
            },
            {
                path: 'suppliers',
                name: 'suppliers',
                component: () => import('../views/user/suppliers/SupplierList.vue'),
                meta: { permission: '106_suppliers', panel: 'user', screen: 106 },
            },
            {
                path: 'categories',
                name: 'categories',
                component: () => import('../views/user/categories/CategoryList.vue'),
                meta: { permission: '108_categories', panel: 'user', screen: 108 },
            },
            {
                path: 'payment-types',
                name: 'payment-types',
                component: () => import('../views/user/payment-types/PaymentTypeList.vue'),
                meta: { permission: '109_payment_types', panel: 'user', screen: 109 },
            },
            {
                path: 'stock-entries',
                name: 'stock-entries',
                component: () => import('../views/user/stock-entries/StockEntryList.vue'),
                meta: { permission: '110_stock_entries', panel: 'user', screen: 110 },
            },
        ],
    },
    {
        path: '/test',
        name: 'test',
        component: () => import('../views/TestPage.vue'),
    },
];

export default routes;
