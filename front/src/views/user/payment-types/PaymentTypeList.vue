<template>
    <LayoutComponent>
        <div class="row items-center justify-between q-mb-lg">
            <div class="text-h5 text-weight-bold" style="color: var(--text-primary)">
                {{ $t('paymentTypes.TITLE') }}
            </div>
            <q-btn color="primary" no-caps icon="add" :label="$t('paymentTypes.actions.CREATE')" @click="openForm(null)" />
        </div>

        <div class="row q-col-gutter-sm q-mb-md">
            <div class="col-12 col-sm-4">
                <q-input v-model="filters.search" :label="$t('common.actions.SEARCH')" outlined dense clearable @update:model-value="loadData">
                    <template #prepend><q-icon name="search" /></template>
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
            :rows="paymentTypes"
            :columns="columns"
            :loading="loading"
            row-key="id"
            flat
            bordered
            v-model:pagination="pagination"
            :rows-per-page-options="[20, 50, 100]"
            @request="onRequest"
        >
            <template #body-cell-status="props">
                <q-td :props="props">
                    <q-icon
                        :name="props.row.status === 'active' ? 'check_circle' : 'cancel'"
                        :color="props.row.status === 'active' ? 'positive' : 'negative'"
                        size="20px"
                    />
                </q-td>
            </template>

            <template #body-cell-actions="props">
                <q-td :props="props">
                    <q-btn flat round icon="edit" size="md" @click="openForm(props.row)">
                        <q-tooltip>{{ $t('common.actions.EDIT') }}</q-tooltip>
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

        <PaymentTypeForm v-model="showForm" :payment-type="selectedPaymentType" @saved="loadData" />
    </LayoutComponent>
</template>

<script>
import LayoutComponent from '../../../components/layout/LayoutComponent.vue';
import PaymentTypeForm from './components/PaymentTypeForm.vue';
import PaymentTypeService from '../../../services/PaymentTypeService';

export default {
    name: 'PaymentTypeList',

    components: { LayoutComponent, PaymentTypeForm },

    data() {
        return {
            paymentTypes: [],
            loading: false,
            showForm: false,
            selectedPaymentType: null,
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
                { name: 'name', label: this.$t('paymentTypes.fields.NAME'), field: 'name', align: 'left', sortable: true },
                { name: 'status', label: 'Status', field: 'status', align: 'center' },
                { name: 'actions', label: this.$t('paymentTypes.fields.ACTIONS'), field: 'actions', align: 'center' },
            ],
            statusOptions: [
                { label: this.$t('paymentTypes.filters.ALL'), value: 'all' },
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
                const { data } = await PaymentTypeService.findAll({
                    search: this.filters.search || undefined,
                    status: this.filters.status,
                    page: this.pagination.page,
                    limit: this.pagination.rowsPerPage,
                });

                this.paymentTypes = data.data.data;
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

        openForm(paymentType) {
            this.selectedPaymentType = paymentType;
            this.showForm = true;
        },
    },
};
</script>
