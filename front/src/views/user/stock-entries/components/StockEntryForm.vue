<template>
    <q-dialog :model-value="modelValue" @update:model-value="$emit('update:modelValue', $event)">
        <q-card style="width: 80vw; max-width: 80vw; height: 80vh; max-height: 80vh">
            <q-card-section>
                <div class="row items-center">
                    <div class="text-h6" style="color: var(--text-primary)">
                        {{ $t('stockEntries.actions.CREATE') }}
                    </div>
                    <q-space />
                    <q-btn flat round icon="close" @click="close" />
                </div>
            </q-card-section>

            <q-separator />

            <q-card-section v-if="!showConfirm">
                <div class="row q-col-gutter-sm q-mb-lg">
                    <div class="col-12 col-sm-6">
                        <q-select
                            v-model="form.supplierId"
                            :options="suppliers"
                            :label="$t('stockEntries.fields.SUPPLIER')"
                            outlined
                            dense
                            emit-value
                            map-options
                            clearable
                        />
                    </div>
                    <div class="col-12 col-sm-6">
                        <q-input
                            v-model="form.invoiceNumber"
                            :label="$t('stockEntries.fields.INVOICE_NUMBER')"
                            outlined
                            dense
                        />
                    </div>
                    <div class="col-12">
                        <q-input
                            v-model="form.observation"
                            :label="$t('stockEntries.fields.OBSERVATION')"
                            outlined
                            dense
                            type="textarea"
                            rows="2"
                        />
                    </div>
                </div>

                <div class="text-subtitle1 text-weight-bold q-mb-sm" style="color: var(--text-primary)">
                    {{ $t('stockEntries.sections.ITEMS') }}
                </div>

                <div v-if="errors.items" class="text-negative text-caption q-mb-sm">
                    {{ $t(errors.items) }}
                </div>

                <q-table
                    :rows="form.items"
                    :columns="itemColumns"
                    row-key="index"
                    flat
                    bordered
                    hide-pagination
                    :rows-per-page-options="[0]"
                >
                    <template #body="props">
                        <q-tr :props="props">
                            <q-td key="product" :props="props">
                                <q-select
                                    v-model="props.row.productId"
                                    :options="productOptions"
                                    :placeholder="$t('stockEntries.placeholders.SELECT_PRODUCT')"
                                    outlined
                                    dense
                                    emit-value
                                    map-options
                                    use-input
                                    hide-bottom-space
                                    @filter="filterProducts"
                                    @update:model-value="onProductSelected(props.rowIndex, $event)"
                                />
                            </q-td>
                            <q-td key="measurementUnit" :props="props" class="text-center" style="color: var(--text-secondary)">
                                {{ props.row.measurementUnitAbbreviation || '—' }}
                            </q-td>
                            <q-td key="stock" :props="props" class="text-center" style="color: var(--text-secondary)">
                                {{ props.row.stock !== null ? props.row.stock : '—' }}
                            </q-td>
                            <q-td key="quantity" :props="props">
                                <q-input
                                    v-model.number="props.row.quantity"
                                    :placeholder="$t('stockEntries.placeholders.QUANTITY')"
                                    type="number"
                                    outlined
                                    dense
                                    hide-bottom-space
                                />
                            </q-td>
                            <q-td key="unitPrice" :props="props">
                                <q-input
                                    :model-value="props.row.unitPriceDisplay"
                                    :placeholder="$t('stockEntries.placeholders.OPTIONAL')"
                                    outlined
                                    dense
                                    hide-bottom-space
                                    prefix="R$"
                                    @update:model-value="onUnitPriceInput(props.rowIndex, $event)"
                                />
                            </q-td>
                            <q-td key="subtotal" :props="props" class="text-center" style="color: var(--text-secondary)">
                                {{ props.row.unitPrice && props.row.quantity ? formatCurrency(props.row.quantity * props.row.unitPrice) : '0' }}
                            </q-td>
                            <q-td key="remove" :props="props" class="text-center">
                                <q-btn flat round icon="delete" size="sm" color="negative" @click="removeItem(props.rowIndex)" />
                            </q-td>
                        </q-tr>
                    </template>

                    <template #bottom>
                        <div class="row full-width items-center justify-between q-pa-sm">
                            <q-btn flat no-caps icon="add" :label="$t('stockEntries.actions.ADD_ITEM')" color="primary" @click="addItem" />
                            <div v-if="totalValue > 0" class="text-weight-bold" style="color: var(--text-primary)">
                                {{ $t('stockEntries.fields.TOTAL_VALUE') }}: {{ formatCurrency(totalValue) }}
                            </div>
                        </div>
                    </template>
                </q-table>

                <div class="row justify-end q-mt-lg">
                    <q-btn color="primary" no-caps :label="$t('stockEntries.actions.REVIEW')" @click="review" />
                </div>
            </q-card-section>

            <StockEntryConfirm
                v-if="showConfirm"
                :form="form"
                :suppliers="suppliers"
                :total-value="totalValue"
                :saving="saving"
                @confirm="confirm"
                @back="showConfirm = false"
            />
        </q-card>
    </q-dialog>
</template>

<script>
import StockEntryConfirm from './StockEntryConfirm.vue';
import StockEntryService from '../../../../services/StockEntryService';
import SupplierService from '../../../../services/SupplierService';
import ProductService from '../../../../services/ProductService';
import { stockEntrySchema } from '../../../../schemas/StockEntrySchema';
import { maskMoney, parseMoney } from '../../../../utils/Masks';
import { formatCurrency } from '../../../../utils/Formatters';

export default {
    name: 'StockEntryForm',

    components: { StockEntryConfirm },

    props: {
        modelValue: { type: Boolean, default: false },
    },

    emits: ['update:modelValue', 'saved'],

    data() {
        return {
            form: {
                supplierId: null,
                invoiceNumber: '',
                observation: '',
                items: [],
            },
            errors: {},
            saving: false,
            showConfirm: false,
            suppliers: [],
            productOptions: [],
            allProducts: [],
            itemColumns: [
                { name: 'product', label: this.$t('stockEntries.fields.PRODUCT'), field: 'product', align: 'center', headerStyle: 'width: 35%' },
                { name: 'measurementUnit', label: this.$t('stockEntries.fields.MEASUREMENT_UNIT'), field: 'measurementUnit', align: 'center', headerStyle: 'width: 8%' },
                { name: 'stock', label: this.$t('stockEntries.fields.CURRENT_STOCK'), field: 'stock', align: 'center', headerStyle: 'width: 10%' },
                { name: 'quantity', label: this.$t('stockEntries.fields.QUANTITY'), field: 'quantity', align: 'center', headerStyle: 'width: 12%' },
                { name: 'unitPrice', label: this.$t('stockEntries.fields.UNIT_PRICE'), field: 'unitPrice', align: 'center', headerStyle: 'width: 14%' },
                { name: 'subtotal', label: this.$t('stockEntries.fields.SUBTOTAL'), field: 'subtotal', align: 'center', headerStyle: 'width: 12%' },
                { name: 'remove', label: '', field: 'remove', align: 'center', headerStyle: 'width: 5%' },
            ],
        };
    },

    computed: {
        totalValue() {
            return this.form.items.reduce((sum, item) => {
                if (item.unitPrice && item.quantity) {
                    return sum + item.quantity * item.unitPrice;
                }
                return sum;
            }, 0);
        },
    },

    created() {
        this.loadSuppliers();
        this.loadProducts();
        this.addItem();
    },

    methods: {
        formatCurrency,

        async loadSuppliers() {
            try {
                const { data } = await SupplierService.findAll({ limit: 1000 });
                this.suppliers = data.data.data.map((supplier) => ({
                    label: supplier.name,
                    value: supplier.id,
                }));
            } catch {
                // Handled by axios interceptor
            }
        },

        async loadProducts() {
            try {
                const { data } = await ProductService.findAll({ status: 'active', limit: 10000 });
                this.allProducts = data.data.data.map((product) => ({
                    label: `${product.name}${product.code ? ' — ' + product.code : ''}`,
                    value: product.id,
                    search: `${product.name} ${product.code || ''} ${product.barcode || ''}`.toLowerCase(),
                    measurementUnitAbbreviation: product.measurementUnit?.abbreviation || '',
                    stock: Number(product.stock),
                }));
                this.productOptions = this.allProducts;
            } catch {
                // Handled by axios interceptor
            }
        },

        filterProducts(value, update) {
            if (!value) {
                update(() => {
                    this.productOptions = this.allProducts;
                });
                return;
            }

            const needle = value.toLowerCase();
            update(() => {
                this.productOptions = this.allProducts.filter((product) => product.search.includes(needle));
            });
        },

        onProductSelected(index, productId) {
            const product = this.allProducts.find((p) => p.value === productId);
            if (product) {
                this.form.items[index].measurementUnitAbbreviation = product.measurementUnitAbbreviation;
                this.form.items[index].productLabel = product.label;
                this.form.items[index].stock = product.stock;
            }
        },

        onUnitPriceInput(index, value) {
            this.form.items[index].unitPriceDisplay = maskMoney(value);
            this.form.items[index].unitPrice = parseMoney(this.form.items[index].unitPriceDisplay);
        },

        addItem() {
            this.form.items.push({
                productId: null,
                productLabel: '',
                measurementUnitAbbreviation: '',
                stock: null,
                quantity: null,
                unitPrice: null,
                unitPriceDisplay: '',
                index: Date.now(),
            });
        },

        removeItem(index) {
            this.form.items.splice(index, 1);
        },

        review() {
            this.errors = {};
            let hasError = false;

            if (this.form.items.length === 0) {
                this.errors.items = 'stockEntries.validations.AT_LEAST_ONE_ITEM';
                hasError = true;
            }

            for (const item of this.form.items) {
                if (!item.productId) {
                    this.errors.items = 'stockEntries.validations.INCOMPLETE_ITEMS';
                    hasError = true;
                    break;
                }
                if (!item.quantity || item.quantity <= 0) {
                    this.errors.items = 'stockEntries.validations.INCOMPLETE_ITEMS';
                    hasError = true;
                    break;
                }
            }

            if (hasError) return;

            this.showConfirm = true;
        },

        async confirm() {
            this.saving = true;

            try {
                const payload = {
                    ...this.form,
                    items: this.form.items.map((item) => ({
                        productId: item.productId,
                        quantity: item.quantity,
                        unitPrice: item.unitPrice ?? null,
                    })),
                };

                await StockEntryService.create(payload);
                this.$emit('saved');
            } finally {
                this.saving = false;
            }
        },

        close() {
            this.$emit('update:modelValue', false);
        },
    },
};
</script>
