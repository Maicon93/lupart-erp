import { createApp } from 'vue';
import { Quasar } from 'quasar';
import quasarLang from 'quasar/lang/pt-BR';

import '@quasar/extras/material-icons/material-icons.css';
import 'quasar/src/css/index.sass';
import './styles/theme.css';

import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';

import i18n from './i18n';
import { toastifyPlugin } from './plugins/toastify';
import { axiosPlugin } from './plugins/axios';
import router from './router';
import App from './App.vue';

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

const app = createApp(App);

app.use(pinia);

app.use(Quasar, {
    plugins: {},
    lang: quasarLang,
});

app.use(i18n);

app.use(toastifyPlugin);

app.use(axiosPlugin);

app.use(router);

app.mount('#app');
