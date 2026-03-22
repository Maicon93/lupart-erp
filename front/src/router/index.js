import { createRouter, createWebHistory } from 'vue-router';
import { $api } from '../plugins/axios';

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
            {
                path: 'admin/access-plans',
                name: 'admin-access-plans',
                component: () => import('../views/admin/access-plans/AccessPlanList.vue'),
                meta: { screen: 10 },
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
const NO_PERMISSION_ROUTES = ['home', 'admin-access-plans'];

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
