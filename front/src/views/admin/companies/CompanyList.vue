<template>
    <LayoutComponent>
        <div class="row items-center justify-between q-mb-lg">
            <div class="text-h5 text-weight-bold" style="color: var(--text-primary)">
                {{ $t('companies.TITLE') }}
            </div>
            <q-btn
                color="primary"
                no-caps
                icon="add"
                :label="$t('companies.actions.CREATE')"
                @click="openForm(null)"
            />
        </div>

        <div class="row q-col-gutter-sm q-mb-md">
            <div class="col-12 col-sm-4">
                <q-input
                    v-model="filters.search"
                    :label="$t('common.actions.SEARCH')"
                    outlined
                    dense
                    clearable
                    @update:model-value="loadData"
                >
                    <template #prepend>
                        <q-icon name="search" />
                    </template>
                </q-input>
            </div>
            <div class="col-12 col-sm-3">
                <q-select
                    v-model="filters.status"
                    :options="statusOptions"
                    :label="$t('common.actions.FILTER')"
                    outlined
                    dense
                    emit-value
                    map-options
                    @update:model-value="loadData"
                />
            </div>
        </div>

        <q-table
            :rows="companies"
            :columns="columns"
            :loading="loading"
            row-key="id"
            flat
            bordered
            v-model:pagination="pagination"
            :rows-per-page-options="[20, 50, 100]"
            @request="onRequest"
        >
            <template #body-cell-accessPlan="props">
                <q-td :props="props">
                    {{ props.row.accessPlan?.title }}
                </q-td>
            </template>

            <template #body-cell-responsible="props">
                <q-td :props="props">
                    {{ props.row.responsible?.name }}
                </q-td>
            </template>

            <template #body-cell-status="props">
                <q-td :props="props">
                    <q-badge :color="props.row.status === 'active' ? 'positive' : 'negative'">
                        {{ props.row.status === 'active' ? $t('common.status.ACTIVE') : $t('common.status.INACTIVE') }}
                    </q-badge>
                </q-td>
            </template>

            <template #body-cell-actions="props">
                <q-td :props="props">
                    <q-btn flat round icon="edit" size="md" @click="openForm(props.row)">
                        <q-tooltip>{{ $t('common.actions.EDIT') }}</q-tooltip>
                    </q-btn>
                    <q-btn flat round icon="manage_search" size="md" color="secondary" @click="handleInspect(props.row)">
                        <q-tooltip>{{ $t('companies.actions.INSPECT') }}</q-tooltip>
                    </q-btn>
                </q-td>
            </template>

            <template #loading>
                <q-inner-loading showing>
                    <q-spinner-dots size="40px" color="primary" />
                </q-inner-loading>
            </template>

            <template #no-data>
                <div class="full-width text-center q-pa-lg" style="color: var(--text-secondary)">
                    {{ $t('common.messages.NOT_FOUND') }}
                </div>
            </template>
        </q-table>

        <CompanyForm
            v-model="showForm"
            :company="selectedCompany"
            @saved="loadData"
        />
    </LayoutComponent>
</template>

<script>
import LayoutComponent from '../../../components/layout/LayoutComponent.vue';
import CompanyForm from './components/CompanyForm.vue';
import CompanyService from '../../../services/CompanyService';
import { useEnterpriseStore } from '../../../stores/enterprise';

export default {
    name: 'CompanyList',

    components: {
        LayoutComponent,
        CompanyForm,
    },

    data() {
        return {
            companies: [],
            loading: false,
            showForm: false,
            selectedCompany: null,
            filters: {
                search: '',
                status: 'all',
            },
            pagination: {
                page: 1,
                rowsPerPage: 20,
                rowsNumber: 0,
            },
            columns: [
                { name: 'name', label: this.$t('companies.fields.NAME'), field: 'name', align: 'left', sortable: true },
                { name: 'cnpj', label: this.$t('companies.fields.CNPJ'), field: 'cnpj', align: 'left' },
                { name: 'accessPlan', label: this.$t('companies.fields.ACCESS_PLAN'), field: 'accessPlan', align: 'left' },
                { name: 'responsible', label: this.$t('companies.fields.RESPONSIBLE'), field: 'responsible', align: 'left' },
                { name: 'status', label: 'Status', field: 'status', align: 'center' },
                { name: 'actions', label: this.$t('companies.fields.ACTIONS'), field: 'actions', align: 'center' },
            ],
            statusOptions: [
                { label: this.$t('companies.filters.ALL'), value: 'all' },
                { label: this.$t('common.status.ACTIVE'), value: 'active' },
                { label: this.$t('common.status.INACTIVE'), value: 'inactive' },
            ],
        };
    },

    created() {
        this.loadData();
    },

    methods: {
        async loadData() {
            this.loading = true;

            try {
                const { data } = await CompanyService.findAll({
                    search: this.filters.search,
                    status: this.filters.status,
                    page: this.pagination.page,
                    limit: this.pagination.rowsPerPage,
                });

                this.companies = data.data.data;
                this.pagination.rowsNumber = data.data.total;
            } catch {
                // Handled by axios interceptor
            } finally {
                this.loading = false;
            }
        },

        onRequest(props) {
            this.pagination.page = props.pagination.page;
            this.pagination.rowsPerPage = props.pagination.rowsPerPage;
            this.loadData();
        },

        async handleInspect(company) {
            try {
                const { data } = await CompanyService.inspect(company.id);
                const enterpriseStore = useEnterpriseStore();
                enterpriseStore.setCompany(data.data);
                this.$router.push({ name: 'home' });
            } catch {
                // Handled by axios interceptor
            }
        },

        async openForm(company) {
            if (company) {
                try {
                    const { data } = await CompanyService.findById(company.id);
                    const fullCompany = data.data;
                    this.selectedCompany = {
                        ...fullCompany,
                        phone: fullCompany.profile?.phone || '',
                        email: fullCompany.profile?.email || '',
                        zipCode: fullCompany.profile?.zipCode || '',
                        street: fullCompany.profile?.street || '',
                        number: fullCompany.profile?.number || '',
                        complement: fullCompany.profile?.complement || '',
                        neighborhood: fullCompany.profile?.neighborhood || '',
                        city: fullCompany.profile?.city || '',
                        state: fullCompany.profile?.state || '',
                    };
                } catch {
                    return;
                }
            } else {
                this.selectedCompany = null;
            }
            this.showForm = true;
        },
    },
};
</script>
