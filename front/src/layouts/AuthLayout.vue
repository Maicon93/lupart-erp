<template>
    <div class="auth-layout" :class="{ 'dark-mode': themeStore.dark }">
        <div class="auth-layout__card" :class="{ 'auth-layout__card--dark': themeStore.dark }">
            <div class="text-center q-mb-lg">
                <span class="auth-layout__logo text-h4 text-weight-bold text-primary">
                    Lupart
                </span>
            </div>

            <router-view />
        </div>
    </div>
</template>

<script>
import { useThemeStore } from '../stores/theme';

export default {
    name: 'AuthLayout',

    data() {
        return {
            themeStore: useThemeStore(),
        };
    },

    watch: {
        'themeStore.dark': {
            immediate: true,
            handler(isDark) {
                this.$q.dark.set(isDark);
            },
        },
    },
};
</script>

<style scoped>
.auth-layout {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    background: url('../assets/images/bg-login.jpg') center / cover no-repeat;
    padding: 16px;
}

.auth-layout__card {
    width: 100%;
    max-width: 420px;
    background-color: var(--bg-card);
    border-radius: 12px;
    padding: 40px 32px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.auth-layout__card--dark {
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.3);
}

.auth-layout__logo {
    letter-spacing: -0.5px;
}
</style>

<style>
.auth-layout input:-webkit-autofill,
.auth-layout input:-webkit-autofill:hover,
.auth-layout input:-webkit-autofill:focus {
    -webkit-box-shadow: 0 0 0 1000px var(--bg-card) inset !important;
    -webkit-text-fill-color: var(--text-primary) !important;
    transition: background-color 5000s ease-in-out 0s;
}
</style>
