<template>
    <LayoutComponent>
        <div class="row items-center justify-between q-mb-lg">
            <div class="text-h5 text-weight-bold" style="color: var(--text-primary)">
                {{ $t('stockEntries.TITLE') }}
            </div>
            <q-btn color="primary" no-caps icon="add" :label="$t('stockEntries.actions.CREATE')" @click="openForm" />
        </div>

        <div class="row q-col-gutter-sm q-mb-md">
            <div class="col-12 col-sm-3">
                <q-input v-model="filters.search" :label="$t('common.actions.SEARCH')" outlined dense clearable @update:model-value="loadData">
                    <template #prepend><q-icon name="search" /></template>
                </q-input>
            </div>
            <div class="col-12 col-sm-2">
                <q-input v-model="filters.dateStart" :label="$t('stockEntries.fields.DATE_START')" type="date" outlined dense clearable @update:model-value="loadData" />
            </div>
            <div class="col-12 col-sm-2">
                <q-input v-model="filters.dateEnd" :label="$t('stockEntries.fields.DATE_END')" type="date" outlined dense clearable @update:model-value="loadData" />
            </div>
            <div class="col-12 col-sm-3">
                <q-input v-model="filters.createdBy" :label="$t('stockEntries.fields.RESPONSIBLE')" outlined dense clearable @update:model-value="loadData">
                    <template #prepend><q-icon name="person" /></template>
                </q-input>
            </div>
        </div>

        <q-table
            :rows="entries"
            :columns="columns"
            :loading="loading"
            row-key="id"
            flat
            bordered
            v-model:pagination="pagination"
            :rows-per-page-options="[20, 50, 100]"
            @request="onRequest"
        >
            <template #body-cell-createdAt="props">
                <q-td :props="props">{{ formatDate(props.row.createdAt) }}</q-td>
            </template>

            <template #body-cell-supplier="props">
                <q-td :props="props">{{ props.row.supplier?.name ?? '—' }}</q-td>
            </template>

            <template #body-cell-totalValue="props">
                <q-td :props="props">{{ props.row.totalValue ? formatCurrency(props.row.totalValue) : '—' }}</q-td>
            </template>

            <template #body-cell-creator="props">
                <q-td :props="props">{{ props.row.creator?.name ?? '—' }}</q-td>
            </template>

            <template #body-cell-actions="props">
                <q-td :props="props">
                    <q-btn flat round icon="visibility" size="md" @click="openDetails(props.row)">
                        <q-tooltip>{{ $t('stockEntries.actions.DETAILS') }}</q-tooltip>
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

        <StockEntryForm v-if="showForm" v-model="showForm" @saved="onSaved" />
        <StockEntryDetails v-if="showDetails" v-model="showDetails" :entry-id="selectedEntryId" />
    </LayoutComponent>
</template>

<script>
import LayoutComponent from '../../../components/layout/LayoutComponent.vue';
import StockEntryForm from './components/StockEntryForm.vue';
import StockEntryDetails from './components/StockEntryDetails.vue';
import StockEntryService from '../../../services/StockEntryService';
import { formatDate, formatCurrency } from '../../../utils/Formatters';

export default {
    name: 'StockEntryList',

    components: { LayoutComponent, StockEntryForm, StockEntryDetails },

    data() {
        return {
            entries: [],
            loading: false,
            showForm: false,
            showDetails: false,
            selectedEntryId: null,
            filters: {
                search: '',
                dateStart: '',
                dateEnd: '',
                createdBy: '',
            },
            pagination: {
                page: 1,
                rowsPerPage: 20,
                rowsNumber: 0,
            },
            columns: [
                { name: 'id', label: this.$t('stockEntries.fields.ENTRY_NUMBER'), field: 'id', align: 'left' },
                { name: 'createdAt', label: this.$t('stockEntries.fields.DATE'), field: 'createdAt', align: 'left' },
                { name: 'invoiceNumber', label: this.$t('stockEntries.fields.INVOICE_NUMBER'), field: 'invoiceNumber', align: 'left' },
                { name: 'supplier', label: this.$t('stockEntries.fields.SUPPLIER'), field: 'supplier', align: 'left' },
                { name: 'itemCount', label: this.$t('stockEntries.fields.ITEM_COUNT'), field: 'itemCount', align: 'center' },
                { name: 'totalValue', label: this.$t('stockEntries.fields.TOTAL_VALUE'), field: 'totalValue', align: 'right' },
                { name: 'creator', label: this.$t('stockEntries.fields.RESPONSIBLE'), field: 'creator', align: 'left' },
                { name: 'actions', label: this.$t('stockEntries.fields.ACTIONS'), field: 'actions', align: 'center' },
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
                const { data } = await StockEntryService.findAll({
                    search: this.filters.search || undefined,
                    dateStart: this.filters.dateStart || undefined,
                    dateEnd: this.filters.dateEnd || undefined,
                    createdBy: this.filters.createdBy || undefined,
                    page: this.pagination.page,
                    limit: this.pagination.rowsPerPage,
                });

                this.entries = data.data.data;
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

        openDetails(entry) {
            this.selectedEntryId = entry.id;
            this.showDetails = true;
        },

        onSaved() {
            this.showForm = false;
            this.loadData();
        },
    },
};
</script>
