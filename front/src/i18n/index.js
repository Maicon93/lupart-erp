import { createI18n } from 'vue-i18n';
import ptBR from './locales/pt-BR.json';
import en from './locales/en.json';

const i18n = createI18n({
    locale: 'pt-BR',
    fallbackLocale: 'en',
    legacy: false,
    messages: {
        'pt-BR': ptBR,
        en,
    },
});

export default i18n;
