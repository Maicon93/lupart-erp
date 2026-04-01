import { createRouter, createWebHistory } from 'vue-router';
import { $api } from '../plugins/axios';
import { useEnterpriseStore } from '../stores/enterprise';

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
            // Admin routes (screens 10-99)
            {
                path: 'admin/access-plans',
                name: 'admin-access-plans',
                component: () => import('../views/admin/access-plans/AccessPlanList.vue'),
                meta: { screen: 10 },
            },
            {
                path: 'admin/companies',
                name: 'admin-companies',
                component: () => import('../views/admin/companies/CompanyList.vue'),
                meta: { screen: 12 },
            },
            {
                path: 'admin/users',
                name: 'admin-users',
                component: () => import('../views/admin/users/UserList.vue'),
                meta: { screen: 11 },
            },
            {
                path: 'admin/positions',
                name: 'admin-positions',
                component: () => import('../views/admin/positions/PositionList.vue'),
                meta: { screen: 13 },
            },
            {
                path: 'admin/system-parameters',
                name: 'admin-system-parameters',
                component: () => import('../views/admin/system-parameters/SystemParameterList.vue'),
                meta: { screen: 15 },
            },
            {
                path: 'admin/permissions',
                name: 'admin-permissions',
                component: () => import('../views/admin/permissions/PermissionList.vue'),
                meta: { screen: 14 },
            },
            // User routes (screens 100+, require company)
            {
                path: 'measurement-units',
                name: 'measurement-units',
                component: () => import('../views/user/measurement-units/MeasurementUnitList.vue'),
                meta: { screen: 104 },
            },
            {
                path: 'customers',
                name: 'customers',
                component: () => import('../views/user/customers/CustomerList.vue'),
                meta: { screen: 105 },
            },
            {
                path: 'suppliers',
                name: 'suppliers',
                component: () => import('../views/user/suppliers/SupplierList.vue'),
                meta: { screen: 106 },
            },
            {
                path: 'categories',
                name: 'categories',
                component: () => import('../views/user/categories/CategoryList.vue'),
                meta: { screen: 108 },
            },
            {
                path: 'payment-types',
                name: 'payment-types',
                component: () => import('../views/user/payment-types/PaymentTypeList.vue'),
                meta: { screen: 109 },
            },
        ],
    },
    {
        path: '/test',
        name: 'test',
        component: () => import('../views/TestPage.vue'),
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

const PUBLIC_ROUTES = ['login', 'test'];
const NO_PERMISSION_ROUTES = ['home'];

router.beforeEach(async (to, from, next) => {
    const token = localStorage.getItem('token');
    const isPublicRoute = PUBLIC_ROUTES.includes(to.name);
    const requiresPermission = !NO_PERMISSION_ROUTES.includes(to.name);

    // Se não está logado e a rota exige auth → login
    if (!token && !isPublicRoute) {
        return next({ name: 'login' });
    }

    // Se já está logado e tenta acessar login → home
    if (token && isPublicRoute) {
        return next({ name: 'home' });
    }

    // Rotas públicas ou sem permissão → acesso livre
    if (isPublicRoute || !requiresPermission) {
        return next();
    }

    // Telas de usuário (100+) exigem empresa selecionada
    const screen = to.meta.screen;
    if (screen >= 100) {
        const enterpriseStore = useEnterpriseStore();
        if (!enterpriseStore.companyId) {
            return next({ name: 'home' });
        }
    }

    // Verificar permissão via API
    try {
        const { data } = await $api.get('/permissions/check', {
            params: { screen: to.meta.screen },
        });

        if (data.data?.hasPermission) {
            return next();
        }

        return next({ name: 'home' });
    } catch {
        return next({ name: 'home' });
    }
});

export default router;
