import { createRouter, createWebHistory } from 'vue-router';
import { $api } from '../plugins/axios';

const routes = [
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
