<template>
    <div class="test-page" :class="{ 'dark-mode': themeStore.dark }">
        <!-- Header -->
        <div class="test-page__header q-pa-lg">
            <div class="test-page__container row justify-between items-center">
                <div class="row items-center q-gutter-md">
                    <q-icon name="science" size="xl" color="primary" />
                    <div>
                        <h1 class="text-h5 text-weight-bold q-ma-none">Lupart Playground</h1>
                        <p class="text-caption q-mt-xs q-mb-none" style="color: var(--text-secondary)">
                            Testando componentes, toasts, i18n, ícones e tema
                        </p>
                    </div>
                </div>
                <div class="row items-center q-gutter-sm">
                    <q-badge :color="themeStore.dark ? 'grey-8' : 'grey-3'" :text-color="themeStore.dark ? 'white' : 'dark'">
                        {{ themeStore.dark ? 'Dark Mode' : 'Light Mode' }}
                    </q-badge>
                    <q-toggle
                        :model-value="themeStore.dark"
                        icon="dark_mode"
                        color="amber"
                        @update:model-value="themeStore.toggleDark()"
                    />
                </div>
            </div>
        </div>

        <!-- Content -->
        <div class="test-page__container column q-gutter-md q-pa-lg">
            <!-- TOAST SECTION -->
            <q-card class="test-card" flat bordered>
                <q-card-section>
                    <div class="row items-center q-gutter-sm">
                        <q-icon name="notifications_active" color="primary" size="sm" />
                        <span class="text-subtitle1 text-weight-bold" style="color: var(--text-primary)">
                            Toasts (vue3-toastify)
                        </span>
                    </div>
                </q-card-section>
                <q-separator />
                <q-card-section>
                    <div class="row q-gutter-sm">
                        <q-btn color="positive" icon="check_circle" label="Success" no-caps @click="showToast('success')" />
                        <q-btn color="negative" icon="error" label="Error" no-caps @click="showToast('error')" />
                        <q-btn color="warning" icon="warning" label="Warning" no-caps text-color="dark" @click="showToast('warning')" />
                        <q-btn color="info" icon="info" label="Info" no-caps @click="showToast('info')" />
                    </div>
                </q-card-section>
            </q-card>

            <!-- I18N SECTION -->
            <q-card class="test-card" flat bordered>
                <q-card-section>
                    <div class="row items-center q-gutter-sm">
                        <q-icon name="translate" color="primary" size="sm" />
                        <span class="text-subtitle1 text-weight-bold" style="color: var(--text-primary)">
                            Internacionalização (i18n)
                        </span>
                    </div>
                </q-card-section>
                <q-separator />
                <q-card-section>
                    <p class="text-caption text-grey q-mb-sm">common.actions.*</p>
                    <div class="row q-gutter-sm q-mb-md">
                        <q-chip v-for="action in i18nActions" :key="action" icon="label" color="primary" text-color="white" size="sm">
                            {{ $t(`common.actions.${action}`) }}
                        </q-chip>
                    </div>
                    <p class="text-caption text-grey q-mb-sm">common.status.*</p>
                    <div class="row q-gutter-sm q-mb-md">
                        <q-chip icon="toggle_on" color="positive" text-color="white" size="sm">
                            {{ $t('common.status.ACTIVE') }}
                        </q-chip>
                        <q-chip icon="toggle_off" color="negative" text-color="white" size="sm">
                            {{ $t('common.status.INACTIVE') }}
                        </q-chip>
                    </div>
                    <p class="text-caption text-grey q-mb-sm">common.messages.*</p>
                    <div class="column q-gutter-xs">
                        <div v-for="message in i18nMessages" :key="message" class="text-body2">
                            <q-icon name="chevron_right" size="xs" color="grey" />
                            {{ $t(`common.messages.${message}`) }}
                        </div>
                    </div>
                </q-card-section>
            </q-card>

            <!-- THEME COLORS SECTION -->
            <q-card class="test-card" flat bordered>
                <q-card-section>
                    <div class="row items-center q-gutter-sm">
                        <q-icon name="palette" color="primary" size="sm" />
                        <span class="text-subtitle1 text-weight-bold" style="color: var(--text-primary)">Cores do Tema</span>
                    </div>
                </q-card-section>
                <q-separator />
                <q-card-section>
                    <div class="row q-gutter-sm">
                        <div v-for="color in themeColors" :key="color" class="column items-center q-gutter-xs">
                            <div class="color-swatch__circle shadow-2" :class="`bg-${color}`"></div>
                            <span class="text-caption" style="color: var(--text-secondary)">{{ color }}</span>
                        </div>
                    </div>
                </q-card-section>
            </q-card>

            <!-- ICONS SECTION -->
            <q-card class="test-card" flat bordered>
                <q-card-section>
                    <div class="row items-center q-gutter-sm">
                        <q-icon name="emoji_symbols" color="primary" size="sm" />
                        <span class="text-subtitle1 text-weight-bold" style="color: var(--text-primary)">Material Icons</span>
                    </div>
                </q-card-section>
                <q-separator />
                <q-card-section>
                    <div class="row q-gutter-md">
                        <div v-for="icon in materialIcons" :key="icon" class="icon-demo column items-center q-gutter-xs">
                            <q-icon :name="icon" size="md" color="primary" />
                            <span class="text-caption text-center" style="color: var(--text-secondary)">{{ icon }}</span>
                        </div>
                    </div>
                </q-card-section>
            </q-card>

            <!-- QUASAR COMPONENTS SECTION -->
            <q-card class="test-card" flat bordered>
                <q-card-section>
                    <div class="row items-center q-gutter-sm">
                        <q-icon name="widgets" color="primary" size="sm" />
                        <span class="text-subtitle1 text-weight-bold" style="color: var(--text-primary)">Componentes Quasar</span>
                    </div>
                </q-card-section>
                <q-separator />
                <q-card-section>
                    <div class="row q-col-gutter-md">
                        <!-- Inputs -->
                        <div class="col-12 col-md-6">
                            <p class="text-caption text-grey q-mb-sm">QInput</p>
                            <q-input v-model="formData.name" label="Nome" outlined dense class="q-mb-sm" />
                            <q-input v-model="formData.email" label="E-mail" outlined dense type="email" />
                        </div>

                        <!-- Select & Toggle -->
                        <div class="col-12 col-md-6">
                            <p class="text-caption text-grey q-mb-sm">QSelect / QToggle</p>
                            <q-select
                                v-model="formData.category"
                                :options="categoryOptions"
                                label="Categoria"
                                outlined
                                dense
                                class="q-mb-sm"
                            />
                            <q-toggle v-model="formData.active" label="Ativo" color="positive" />
                        </div>

                        <!-- Buttons -->
                        <div class="col-12">
                            <p class="text-caption text-grey q-mb-sm">QBtn</p>
                            <div class="row q-gutter-sm">
                                <q-btn color="primary" icon="save" :label="$t('common.actions.SAVE')" no-caps />
                                <q-btn outline color="primary" icon="edit" :label="$t('common.actions.EDIT')" no-caps />
                                <q-btn flat color="negative" icon="delete" :label="$t('common.actions.DELETE')" no-caps />
                                <q-btn round color="accent" icon="add" />
                                <q-btn color="primary" icon="hourglass_top" label="Loading" no-caps loading />
                            </div>
                        </div>

                        <!-- Dialog -->
                        <div class="col-12">
                            <p class="text-caption text-grey q-mb-sm">QDialog</p>
                            <q-btn color="primary" icon="open_in_new" label="Abrir Dialog" no-caps @click="showDialog = true" />
                            <q-dialog v-model="showDialog">
                                <q-card style="min-width: 350px">
                                    <q-card-section class="row items-center">
                                        <q-icon name="info" color="primary" size="sm" class="q-mr-sm" />
                                        <span class="text-h6">Dialog de Teste</span>
                                    </q-card-section>
                                    <q-card-section>
                                        Este é um QDialog funcional do Quasar.
                                    </q-card-section>
                                    <q-card-actions align="right">
                                        <q-btn flat :label="$t('common.actions.CANCEL')" color="grey" v-close-popup no-caps />
                                        <q-btn flat :label="$t('common.actions.CONFIRM')" color="primary" v-close-popup no-caps />
                                    </q-card-actions>
                                </q-card>
                            </q-dialog>
                        </div>
                    </div>
                </q-card-section>
            </q-card>

            <!-- TABLE SECTION -->
            <q-card class="test-card" flat bordered>
                <q-card-section>
                    <div class="row items-center q-gutter-sm">
                        <q-icon name="table_chart" color="primary" size="sm" />
                        <span class="text-subtitle1 text-weight-bold" style="color: var(--text-primary)">QTable</span>
                    </div>
                </q-card-section>
                <q-separator />
                <q-card-section>
                    <q-table :rows="tableRows" :columns="tableColumns" row-key="id" flat bordered dense />
                </q-card-section>
            </q-card>
        </div>
    </div>
</template>

<script>
import { toast } from 'vue3-toastify';
import { useQuasar } from 'quasar';
import { useThemeStore } from '../stores/theme';

export default {
    name: 'TestPage',

    setup() {
        const quasar = useQuasar();
        return { quasar };
    },

    watch: {
        'themeStore.dark': {
            handler(value) {
                this.quasar.dark.set(value);
            },
            immediate: true,
        },
    },

    data() {
        return {
            showDialog: false,
            formData: {
                name: '',
                email: '',
                category: null,
                active: true,
            },
            categoryOptions: ['Eletrônicos', 'Roupas', 'Alimentos', 'Serviços'],
            i18nActions: ['SAVE', 'CANCEL', 'DELETE', 'EDIT', 'CREATE', 'SEARCH', 'FILTER', 'BACK', 'CONFIRM', 'CLOSE'],
            i18nMessages: ['CREATED', 'UPDATED', 'DELETED', 'ERROR', 'NOT_FOUND', 'UNAUTHORIZED', 'FORBIDDEN', 'TOO_MANY_REQUESTS'],
            themeColors: ['primary', 'secondary', 'accent', 'positive', 'negative', 'info', 'warning', 'dark'],
            materialIcons: [
                'home',
                'person',
                'shopping_cart',
                'inventory_2',
                'point_of_sale',
                'receipt_long',
                'account_balance_wallet',
                'bar_chart',
                'settings',
                'logout',
                'search',
                'add',
                'edit',
                'delete',
                'visibility',
                'file_download',
            ],
            tableColumns: [
                { name: 'id', label: 'ID', field: 'id', align: 'left' },
                { name: 'name', label: 'Nome', field: 'name', align: 'left' },
                { name: 'category', label: 'Categoria', field: 'category', align: 'left' },
                { name: 'price', label: 'Preço', field: 'price', align: 'right', format: (val) => `R$ ${val.toFixed(2)}` },
                { name: 'status', label: 'Status', field: 'status', align: 'center' },
            ],
            tableRows: [
                { id: 1, name: 'Notebook Dell', category: 'Eletrônicos', price: 4599.9, status: 'Ativo' },
                { id: 2, name: 'Mouse Logitech', category: 'Eletrônicos', price: 189.9, status: 'Ativo' },
                { id: 3, name: 'Camiseta Polo', category: 'Roupas', price: 79.9, status: 'Inativo' },
                { id: 4, name: 'Café Premium', category: 'Alimentos', price: 32.5, status: 'Ativo' },
            ],
        };
    },

    computed: {
        themeStore() {
            return useThemeStore();
        },
    },

    methods: {
        showToast(type) {
            const messageKey = {
                success: 'common.messages.CREATED',
                error: 'common.messages.ERROR',
                warning: 'common.messages.TOO_MANY_REQUESTS',
                info: 'common.messages.NOT_FOUND',
            }[type];

            toast[type](this.$t(messageKey));
        },
    },
};
</script>

<style scoped>
.test-page {
    min-height: 100vh;
    background: var(--bg-page);
    color: var(--text-primary);
    transition: all 0.3s ease;
}

.test-page__header {
    background: var(--bg-header);
    border-bottom: 1px solid var(--border-color);
}

.test-page__container {
    max-width: 1200px;
    margin: 0 auto;
}

.test-card {
    border-radius: 8px;
    background: var(--bg-card);
    border-color: var(--border-color);
    transition: all 0.3s ease;
}

.color-swatch__circle {
    width: 48px;
    height: 48px;
    border-radius: 50%;
}

.icon-demo {
    width: 72px;
}
</style>
