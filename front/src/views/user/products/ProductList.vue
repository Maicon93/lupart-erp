<template>
    <LayoutComponent>
        <div class="row items-center justify-between q-mb-lg">
            <div class="text-h5 text-weight-bold" style="color: var(--text-primary)">
                {{ $t('products.TITLE') }}
            </div>
            <q-btn color="primary" no-caps icon="add" :label="$t('products.actions.CREATE')" @click="openForm(null)" />
        </div>

        <div class="row q-col-gutter-sm q-mb-md">
            <div class="col-12 col-sm-3">
                <q-input v-model="filters.search" :label="$t('common.actions.SEARCH')" outlined dense clearable @update:model-value="loadData">
                    <template #prepend><q-icon name="search" /></template>
                </q-input>
            </div>
            <div class="col-12 col-sm-2">
                <q-select
                    v-model="filters.type"
                    :options="typeOptions"
                    :label="$t('products.fields.TYPE')"
                    outlined
                    dense
                    emit-value
                    map-options
                    @update:model-value="loadData"
                />
            </div>
            <div class="col-12 col-sm-3">
                <q-select
                    v-model="filters.categoryId"
                    :options="categoryOptions"
                    :label="$t('products.fields.CATEGORY')"
                    outlined
                    dense
                    emit-value
                    map-options
                    clearable
                    @update:model-value="loadData"
                />
            </div>
            <div class="col-12 col-sm-2">
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
            :rows="products"
            :columns="columns"
            :loading="loading"
            row-key="id"
            flat
            bordered
            v-model:pagination="pagination"
            :rows-per-page-options="[20, 50, 100]"
            @request="onRequest"
        >
            <template #body-cell-type="props">
                <q-td :props="props">
                    <q-badge :color="props.row.type === 'product' ? 'primary' : 'teal'">
                        {{ props.row.type === 'product' ? $t('products.types.PRODUCT') : $t('products.types.SERVICE') }}
                    </q-badge>
                </q-td>
            </template>

            <template #body-cell-category="props">
                <q-td :props="props">{{ props.row.category?.name }}</q-td>
            </template>

            <template #body-cell-measurementUnit="props">
                <q-td :props="props">{{ props.row.measurementUnit?.abbreviation || '—' }}</q-td>
            </template>

            <template #body-cell-salePrice="props">
                <q-td :props="props">{{ formatCurrency(props.row.salePrice) }}</q-td>
            </template>

            <template #body-cell-averageCost="props">
                <q-td :props="props">{{ formatCurrency(props.row.averageCost) }}</q-td>
            </template>

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

        <ProductForm v-model="showForm" :product="selectedProduct" @saved="loadData" />
    </LayoutComponent>
</template>

<script>
import LayoutComponent from '../../../components/layout/LayoutComponent.vue';
import ProductForm from './components/ProductForm.vue';
import ProductService from '../../../services/ProductService';
import CategoryService from '../../../services/CategoryService';

export default {
    name: 'ProductList',

    components: { LayoutComponent, ProductForm },

    data() {
        return {
            products: [],
            loading: false,
            showForm: false,
            selectedProduct: null,
            categoryOptions: [],
            filters: {
                search: '',
                type: 'all',
                categoryId: null,
                status: 'all',
            },
            pagination: {
                page: 1,
                rowsPerPage: 20,
                rowsNumber: 0,
            },
            columns: [
                { name: 'name', label: this.$t('products.fields.NAME'), field: 'name', align: 'left', sortable: true },
                { name: 'code', label: this.$t('products.fields.CODE'), field: 'code', align: 'left' },
                { name: 'type', label: this.$t('products.fields.TYPE'), field: 'type', align: 'center' },
                { name: 'category', label: this.$t('products.fields.CATEGORY'), field: 'category', align: 'left' },
                { name: 'measurementUnit', label: this.$t('products.fields.MEASUREMENT_UNIT'), field: 'measurementUnit', align: 'left' },
                { name: 'salePrice', label: this.$t('products.fields.SALE_PRICE'), field: 'salePrice', align: 'right' },
                { name: 'averageCost', label: this.$t('products.fields.AVERAGE_COST'), field: 'averageCost', align: 'right' },
                { name: 'stock', label: this.$t('products.fields.STOCK'), field: 'stock', align: 'right' },
                { name: 'status', label: this.$t('products.fields.STATUS'), field: 'status', align: 'center' },
                { name: 'actions', label: this.$t('products.fields.ACTIONS'), field: 'actions', align: 'center' },
            ],
            typeOptions: [
                { label: this.$t('products.filters.ALL'), value: 'all' },
                { label: this.$t('products.types.PRODUCT'), value: 'product' },
                { label: this.$t('products.types.SERVICE'), value: 'service' },
            ],
            statusOptions: [
                { label: this.$t('products.filters.ALL'), value: 'all' },
                { label: this.$t('common.status.ACTIVE'), value: 'active' },
                { label: this.$t('common.status.INACTIVE'), value: 'inactive' },
            ],
        };
    },

    created() {
        this.loadCategories();
        this.loadData();
    },

    methods: {
        formatCurrency(value) {
            return Number(value).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        },

        async loadCategories() {
            try {
                const { data } = await CategoryService.findAll({ status: 'active', limit: 1000 });
                this.categoryOptions = data.data.data.map((category) => ({
                    label: category.name,
                    value: category.id,
                }));
            } catch {
                // Handled by axios interceptor
            }
        },

        async loadData() {
            this.loading = true;

            try {
                const { data } = await ProductService.findAll({
                    search: this.filters.search || undefined,
                    type: this.filters.type,
                    categoryId: this.filters.categoryId || undefined,
                    status: this.filters.status,
                    page: this.pagination.page,
                    limit: this.pagination.rowsPerPage,
                });

                this.products = data.data.data;
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

        openForm(product) {
            this.selectedProduct = product;
            this.showForm = true;
        },
    },
};
</script>
