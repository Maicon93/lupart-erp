import { createRouter, createWebHistory } from 'vue-router';
import { $api } from '../plugins/axios';
import { useEnterpriseStore } from '../stores/enterprise';
import routes from './routes';

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

    // Telas de usuário exigem empresa selecionada
    if (to.meta.panel === 'user') {
        const enterpriseStore = useEnterpriseStore();
        if (!enterpriseStore.companyId) {
            return next({ name: 'home' });
        }
    }

    // Verificar permissão via API
    try {
        const { data } = await $api.get('/permissions/check', {
            params: { permission: to.meta.permission },
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
