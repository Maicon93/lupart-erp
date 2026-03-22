<template>
    <LayoutComponent>
        <div class="text-h5 text-weight-bold q-mb-lg" style="color: var(--text-primary)">
            {{ $t('home.TITLE') }}
        </div>

        <div class="row q-col-gutter-md">
            <div class="col-12 col-md-8">
                <q-card flat bordered>
                    <q-card-section>
                        <div class="row items-center q-gutter-sm q-mb-md">
                            <q-icon name="waving_hand" size="28px" color="warning" />
                            <span class="text-h6 text-weight-medium" style="color: var(--text-primary)">
                                {{ $t('home.WELCOME') }}
                            </span>
                        </div>
                        <div class="text-body1" style="color: var(--text-secondary)">
                            {{ $t('home.DESCRIPTION') }}
                        </div>
                    </q-card-section>
                </q-card>

                <q-card flat bordered class="q-mt-md">
                    <q-card-section>
                        <div class="text-subtitle1 text-weight-medium q-mb-md" style="color: var(--text-primary)">
                            {{ $t('home.QUICK_LINKS') }}
                        </div>

                        <div class="row q-col-gutter-sm">
                            <div v-for="link in quickLinks" :key="link.icon" class="col-12 col-sm-6">
                                <q-item clickable class="rounded-borders home__link-item">
                                    <q-item-section avatar>
                                        <q-icon :name="link.icon" :color="link.color" />
                                    </q-item-section>
                                    <q-item-section>
                                        <q-item-label style="color: var(--text-primary)">
                                            {{ $t(link.title) }}
                                        </q-item-label>
                                        <q-item-label caption>
                                            {{ $t(link.subtitle) }}
                                        </q-item-label>
                                    </q-item-section>
                                    <q-item-section side>
                                        <q-icon name="chevron_right" style="color: var(--text-secondary)" />
                                    </q-item-section>
                                </q-item>
                            </div>
                        </div>
                    </q-card-section>
                </q-card>
            </div>

            <div class="col-12 col-md-4">
                <q-card flat bordered>
                    <q-card-section>
                        <div class="text-subtitle1 text-weight-medium q-mb-md" style="color: var(--text-primary)">
                            {{ $t('home.SUPPORT') }}
                        </div>

                        <q-list dense>
                            <q-item v-for="contact in contacts" :key="contact.icon">
                                <q-item-section avatar>
                                    <q-icon :name="contact.icon" size="20px" color="primary" />
                                </q-item-section>
                                <q-item-section>
                                    <q-item-label caption>{{ $t(contact.label) }}</q-item-label>
                                    <q-item-label style="color: var(--text-primary)">
                                        {{ contact.value }}
                                    </q-item-label>
                                </q-item-section>
                            </q-item>
                        </q-list>
                    </q-card-section>

                    <q-separator />

                    <q-card-section>
                        <div class="text-subtitle1 text-weight-medium q-mb-sm" style="color: var(--text-primary)">
                            {{ $t('home.HOURS') }}
                        </div>
                        <div class="text-body2" style="color: var(--text-secondary)">
                            {{ $t('home.HOURS_WEEKDAYS') }}
                        </div>
                        <div class="text-body2" style="color: var(--text-secondary)">
                            {{ $t('home.HOURS_SATURDAY') }}
                        </div>
                    </q-card-section>
                </q-card>

                <q-card flat bordered class="q-mt-md">
                    <q-card-section class="text-center">
                        <div class="text-caption" style="color: var(--text-secondary)">
                            Lupart ERP &mdash; v1.0.0
                        </div>
                    </q-card-section>
                </q-card>
            </div>
        </div>
    </LayoutComponent>
</template>

<script>
import LayoutComponent from '../../components/layout/LayoutComponent.vue';

export default {
    name: 'HomeView',

    components: {
        LayoutComponent,
    },

    data() {
        return {
            quickLinks: [
                { icon: 'inventory_2', color: 'primary', title: 'home.links.PRODUCTS', subtitle: 'home.links.PRODUCTS_DESC' },
                { icon: 'point_of_sale', color: 'positive', title: 'home.links.SALES', subtitle: 'home.links.SALES_DESC' },
                { icon: 'people', color: 'info', title: 'home.links.CUSTOMERS', subtitle: 'home.links.CUSTOMERS_DESC' },
                { icon: 'build', color: 'warning', title: 'home.links.SERVICE_ORDERS', subtitle: 'home.links.SERVICE_ORDERS_DESC' },
            ],
            contacts: [
                { icon: 'email', label: 'home.contact.EMAIL', value: 'suporte@lupart.com.br' },
                { icon: 'phone', label: 'home.contact.PHONE', value: '(11) 99999-9999' },
                { icon: 'language', label: 'home.contact.WEBSITE', value: 'www.lupart.com.br' },
            ],
        };
    },
};
</script>

<style scoped>
.home__link-item {
    border: 1px solid var(--border-color);
}
</style>
