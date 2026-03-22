<template>
    <q-form @submit.prevent="handleLogin">
        <q-input
            v-model="form.email"
            :label="$t('login.fields.EMAIL')"
            type="email"
            outlined
            :error="!!errors.email"
            :error-message="errors.email ? $t(errors.email) : ''"
            @update:model-value="clearError('email')"
        >
            <template #prepend>
                <q-icon name="mail" />
            </template>
        </q-input>

        <q-input
            v-model="form.password"
            :label="$t('login.fields.PASSWORD')"
            :type="showPassword ? 'text' : 'password'"
            outlined
            class="q-mt-sm"
            :error="!!errors.password"
            :error-message="errors.password ? $t(errors.password) : ''"
            @update:model-value="clearError('password')"
        >
            <template #prepend>
                <q-icon name="lock" />
            </template>
            <template #append>
                <q-icon
                    :name="showPassword ? 'visibility_off' : 'visibility'"
                    class="cursor-pointer"
                    @click="showPassword = !showPassword"
                />
            </template>
        </q-input>

        <q-btn
            type="submit"
            :label="$t('login.actions.LOGIN')"
            color="primary"
            class="full-width q-mt-lg"
            size="lg"
            no-caps
            :loading="loading"
        />
    </q-form>
</template>

<script>
import { useAuthStore } from '../../stores/auth';
import { useEnterpriseStore } from '../../stores/enterprise';
import { loginSchema } from '../../schemas/LoginSchema';
import AuthService from '../../services/AuthService';

export default {
    name: 'LoginView',

    data() {
        return {
            form: {
                email: '',
                password: '',
            },
            errors: {
                email: null,
                password: null,
            },
            showPassword: false,
            loading: false,
        };
    },

    methods: {
        clearError(field) {
            this.errors[field] = null;
        },

        validate() {
            const result = loginSchema.safeParse(this.form);

            if (result.success) {
                this.errors = { email: null, password: null };
                return true;
            }

            this.errors = { email: null, password: null };
            result.error.issues.forEach((issue) => {
                const field = issue.path[0];
                if (!this.errors[field]) {
                    this.errors[field] = issue.message;
                }
            });

            return false;
        },

        async handleLogin() {
            if (!this.validate()) return;

            this.loading = true;

            try {
                const { data } = await AuthService.login(this.form);
                const { token, user, role, companies } = data.data;

                localStorage.setItem('token', token);

                const authStore = useAuthStore();
                authStore.setAuth(user, token, role);

                if (role === 'admin') {
                    this.$router.push({ name: 'home' });
                    return;
                }

                if (companies.length === 1) {
                    const enterpriseStore = useEnterpriseStore();
                    enterpriseStore.setCompany(companies[0]);
                    this.$router.push({ name: 'home' });
                } else {
                    this.$router.push({ name: 'select-company' });
                }
            } catch {
                // Errors handled by axios interceptor
            } finally {
                this.loading = false;
            }
        },
    },
};
</script>
