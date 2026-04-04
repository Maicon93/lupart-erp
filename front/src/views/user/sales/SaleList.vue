<template>
    <LayoutComponent>
        <div class="row items-center justify-between q-mb-lg">
            <div class="text-h5 text-weight-bold" style="color: var(--text-primary)">
                {{ $t('sales.TITLE') }}
            </div>
            <q-btn color="primary" no-caps icon="add" :label="$t('sales.actions.CREATE')" @click="openForm" />
        </div>

        <div class="row q-col-gutter-sm q-mb-md">
            <div class="col-12 col-sm-4">
                <q-input v-model="filters.search" :label="$t('common.actions.SEARCH')" outlined dense clearable @update:model-value="loadData">
                    <template #prepend><q-icon name="search" /></template>
                </q-input>
            </div>
            <div class="col-12 col-sm-3">
                <q-input v-model="filters.dateStart" :label="$t('sales.fields.DATE_START')" type="date" outlined dense clearable @update:model-value="loadData" />
            </div>
            <div class="col-12 col-sm-3">
                <q-input v-model="filters.dateEnd" :label="$t('sales.fields.DATE_END')" type="date" outlined dense clearable @update:model-value="loadData" />
            </div>
        </div>

        <q-table
            :rows="sales"
            :columns="columns"
            :loading="loading"
            row-key="id"
            flat
            bordered
            v-model:pagination="pagination"
            :rows-per-page-options="[20, 50, 100]"
            @request="onRequest"
        >
            <template #body-cell-date="props">
                <q-td :props="props">{{ formatDate(props.row.date) }}</q-td>
            </template>

            <template #body-cell-customer="props">
                <q-td :props="props">{{ props.row.customer?.name ?? '—' }}</q-td>
            </template>

            <template #body-cell-finalValue="props">
                <q-td :props="props">{{ formatCurrency(props.row.finalValue) }}</q-td>
            </template>

            <template #body-cell-status="props">
                <q-td :props="props">
                    <q-badge :color="props.row.status === SALE_STATUS.FINALIZED ? 'positive' : 'negative'" :label="$t(`sales.status.${props.row.status.toUpperCase()}`)" />
                </q-td>
            </template>

            <template #body-cell-creator="props">
                <q-td :props="props">{{ props.row.creator?.name ?? '—' }}</q-td>
            </template>

            <template #body-cell-actions="props">
                <q-td :props="props">
                    <q-btn flat round icon="visibility" size="md" @click="openDetails(props.row)">
                        <q-tooltip>{{ $t('sales.actions.DETAILS') }}</q-tooltip>
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

        <SaleForm v-if="showForm" v-model="showForm" @saved="onSaved" />
        <SaleDetails v-if="showDetails" v-model="showDetails" :sale-id="selectedSaleId" />
    </LayoutComponent>
</template>

<script>
import LayoutComponent from '../../../components/layout/LayoutComponent.vue';
import SaleForm from './components/SaleForm.vue';
import SaleDetails from './components/SaleDetails.vue';
import SaleService from '../../../services/SaleService';
import { formatDate, formatCurrency } from '../../../utils/Formatters';
import { SALE_STATUS } from '../../../utils/SaleConstants';

export default {
    name: 'SaleList',

    components: { LayoutComponent, SaleForm, SaleDetails },

    data() {
        return {
            SALE_STATUS,
            sales: [],
            loading: false,
            showForm: false,
            showDetails: false,
            selectedSaleId: null,
            filters: {
                search: '',
                dateStart: '',
                dateEnd: '',
            },
            pagination: {
                page: 1,
                rowsPerPage: 20,
                rowsNumber: 0,
            },
            columns: [
                { name: 'id', label: this.$t('sales.fields.SALE_NUMBER'), field: 'id', align: 'left' },
                { name: 'date', label: this.$t('sales.fields.DATE'), field: 'date', align: 'left' },
                { name: 'customer', label: this.$t('sales.fields.CUSTOMER'), field: 'customer', align: 'left' },
                { name: 'finalValue', label: this.$t('sales.fields.FINAL_VALUE'), field: 'finalValue', align: 'right' },
                { name: 'status', label: this.$t('sales.fields.STATUS'), field: 'status', align: 'center' },
                { name: 'creator', label: this.$t('sales.fields.RESPONSIBLE'), field: 'creator', align: 'left' },
                { name: 'actions', label: this.$t('sales.fields.ACTIONS'), field: 'actions', align: 'center' },
            ],
        };
    },

    created() {
        this.loadData();
    },

    methods: {
        formatDate,
        formatCurrency,

        async loadData() {
            this.loading = true;

            try {
                const { data } = await SaleService.findAll({
                    search: this.filters.search || undefined,
                    dateStart: this.filters.dateStart || undefined,
                    dateEnd: this.filters.dateEnd || undefined,
                    page: this.pagination.page,
                    limit: this.pagination.rowsPerPage,
                });

                this.sales = data.data.data;
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

        openForm() {
            this.showForm = true;
        },

        openDetails(sale) {
            this.selectedSaleId = sale.id;
            this.showDetails = true;
        },

        onSaved() {
            this.showForm = false;
            this.loadData();
        },
    },
};
</script>
