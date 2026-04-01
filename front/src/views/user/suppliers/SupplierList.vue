<template>
    <LayoutComponent>
        <div class="row items-center justify-between q-mb-lg">
            <div class="text-h5 text-weight-bold" style="color: var(--text-primary)">
                {{ $t('suppliers.TITLE') }}
            </div>
            <q-btn color="primary" no-caps icon="add" :label="$t('suppliers.actions.CREATE')" @click="openForm(null)" />
        </div>

        <div class="row q-col-gutter-sm q-mb-md">
            <div class="col-12 col-sm-4">
                <q-input v-model="filters.search" :label="$t('common.actions.SEARCH')" outlined dense clearable @update:model-value="loadData">
                    <template #prepend><q-icon name="search" /></template>
                </q-input>
            </div>
        </div>

        <q-table
            :rows="suppliers"
            :columns="columns"
            :loading="loading"
            row-key="id"
            flat
            bordered
            v-model:pagination="pagination"
            :rows-per-page-options="[20, 50, 100]"
            @request="onRequest"
        >
            <template #body-cell-actions="props">
                <q-td :props="props">
                    <q-btn flat round icon="edit" size="md" @click="openForm(props.row)">
                        <q-tooltip>{{ $t('common.actions.EDIT') }}</q-tooltip>
                    </q-btn>
                    <q-btn flat round icon="delete" size="md" color="negative" @click="handleDelete(props.row)">
                        <q-tooltip>{{ $t('common.actions.DELETE') }}</q-tooltip>
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

        <SupplierForm v-model="showForm" :supplier="selectedSupplier" @saved="loadData" />
    </LayoutComponent>
</template>

<script>
import LayoutComponent from '../../../components/layout/LayoutComponent.vue';
import SupplierForm from './components/SupplierForm.vue';
import SupplierService from '../../../services/SupplierService';

export default {
    name: 'SupplierList',

    components: { LayoutComponent, SupplierForm },

    data() {
        return {
            suppliers: [],
            loading: false,
            showForm: false,
            selectedSupplier: null,
            filters: {
                search: '',
            },
            pagination: {
                page: 1,
                rowsPerPage: 20,
                rowsNumber: 0,
            },
            columns: [
                { name: 'name', label: this.$t('suppliers.fields.NAME'), field: 'name', align: 'left', sortable: true },
                { name: 'cpfCnpj', label: this.$t('suppliers.fields.CPF_CNPJ'), field: 'cpfCnpj', align: 'left' },
                { name: 'phone', label: this.$t('suppliers.fields.PHONE'), field: 'phone', align: 'left' },
                { name: 'email', label: this.$t('suppliers.fields.EMAIL'), field: 'email', align: 'left' },
                { name: 'actions', label: this.$t('suppliers.fields.ACTIONS'), field: 'actions', align: 'center' },
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
                const { data } = await SupplierService.findAll({
                    search: this.filters.search || undefined,
                    page: this.pagination.page,
                    limit: this.pagination.rowsPerPage,
                });

                this.suppliers = data.data.data;
                this.pagination.rowsNumber = data.data.total;
            } finally {
                this.loading = false;
            }
        },

        onRequest(props) {
            this.pagination.page = props.pagination.page;
            this.pagination.rowsPerPage = props.pagination.rowsPerPage;
            this.loadData();
        },

        openForm(supplier) {
            this.selectedSupplier = supplier;
            this.showForm = true;
        },

        handleDelete(supplier) {
            this.$q.dialog({
                title: this.$t('common.actions.CONFIRM'),
                message: this.$t('suppliers.messages.CONFIRM_DELETE', { name: supplier.name }),
                cancel: { label: this.$t('common.actions.CANCEL'), flat: true, noCaps: true },
                ok: { label: this.$t('common.actions.DELETE'), color: 'negative', noCaps: true },
                persistent: true,
            }).onOk(async () => {
                try {
                    await SupplierService.remove(supplier.id);
                    this.loadData();
                } catch {
                    // Handled by axios interceptor
                }
            });
        },
    },
};
</script>
