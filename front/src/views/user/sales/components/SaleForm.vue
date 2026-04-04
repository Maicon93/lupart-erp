<template>
    <q-dialog :model-value="modelValue" @update:model-value="$emit('update:modelValue', $event)">
        <q-card style="width: 80vw; max-width: 80vw; height: 80vh; max-height: 80vh; display: flex; flex-direction: column">
            <q-card-section class="row items-center q-pb-none">
                <div class="text-h6" style="color: var(--text-primary)">
                    {{ $t('sales.actions.CREATE') }}
                </div>
                <q-space />
                <q-btn v-if="step !== 'pdf'" flat round icon="close" @click="close" />
            </q-card-section>

            <q-separator class="q-mt-sm" />

            <!-- Step: Items -->
            <template v-if="step === 'items'">
                <q-card-section class="col overflow-auto">
                    <div class="row q-col-gutter-sm q-mb-lg">
                        <div class="col-12 col-sm-5">
                            <div class="row items-center q-gutter-sm">
                                <div class="col">
                                    <q-select
                                        v-model="form.customerId"
                                        :options="customerOptions"
                                        :label="$t('sales.fields.CUSTOMER') + ' *'"
                                        outlined
                                        dense
                                        emit-value
                                        map-options
                                        use-input
                                        hide-bottom-space
                                        :error="!!errors.customerId"
                                        :error-message="errors.customerId ? $t(errors.customerId) : ''"
                                        @filter="filterCustomers"
                                        @update:model-value="errors.customerId = null"
                                    />
                                </div>
                                <q-btn flat dense icon="person_add" color="primary" @click="openNewCustomer">
                                    <q-tooltip>{{ $t('sales.actions.NEW_CUSTOMER') }}</q-tooltip>
                                </q-btn>
                            </div>
                        </div>
                        <div class="col-12 col-sm-3">
                            <q-input
                                v-model="form.date"
                                :label="$t('sales.fields.DATE') + ' *'"
                                type="date"
                                outlined
                                dense
                                hide-bottom-space
                                :error="!!errors.date"
                                :error-message="errors.date ? $t(errors.date) : ''"
                                @update:model-value="errors.date = null"
                            />
                        </div>
                        <div class="col-12">
                            <q-input
                                v-model="form.observation"
                                :label="$t('sales.fields.OBSERVATION')"
                                outlined
                                dense
                                type="textarea"
                                rows="2"
                            />
                        </div>
                    </div>

                    <div class="text-subtitle1 text-weight-bold q-mb-sm" style="color: var(--text-primary)">
                        {{ $t('sales.sections.ITEMS') }}
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
                                        :placeholder="$t('sales.placeholders.SELECT_PRODUCT')"
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
                                    {{ props.row.productType === 'service' ? '—' : (props.row.stock ?? '—') }}
                                </q-td>
                                <q-td key="quantity" :props="props">
                                    <q-input
                                        v-model.number="props.row.quantity"
                                        :placeholder="$t('sales.placeholders.QUANTITY')"
                                        type="number"
                                        outlined
                                        dense
                                        hide-bottom-space
                                        :error="!!props.row.stockError"
                                        :error-message="props.row.stockError ? $t(props.row.stockError) : ''"
                                        @update:model-value="onQuantityInput(props.rowIndex)"
                                    />
                                </q-td>
                                <q-td key="unitPrice" :props="props">
                                    <q-input
                                        :model-value="props.row.unitPriceDisplay"
                                        outlined
                                        dense
                                        hide-bottom-space
                                        prefix="R$"
                                        @update:model-value="onUnitPriceInput(props.rowIndex, $event)"
                                    />
                                </q-td>
                                <q-td key="subtotal" :props="props" class="text-right">
                                    <span class="text-weight-bold" style="color: var(--text-primary)">
                                        {{ props.row.unitPrice && props.row.quantity ? formatCurrency(props.row.quantity * props.row.unitPrice) : formatCurrency(0) }}
                                    </span>
                                </q-td>
                                <q-td key="remove" :props="props" class="text-center">
                                    <q-btn flat round icon="delete" size="sm" color="negative" @click="removeItem(props.rowIndex)" />
                                </q-td>
                            </q-tr>
                        </template>

                        <template #bottom>
                            <div class="row full-width items-center justify-between q-pa-sm">
                                <q-btn flat no-caps icon="add" :label="$t('sales.actions.ADD_ITEM')" color="primary" @click="addItem" />
                                <div v-if="totalValue > 0" class="text-subtitle1 text-weight-bold" style="color: var(--text-primary)">
                                    {{ $t('sales.fields.TOTAL_VALUE') }}: {{ formatCurrency(totalValue) }}
                                </div>
                            </div>
                        </template>
                    </q-table>

                    <div class="row justify-end q-mt-lg">
                        <q-btn color="primary" no-caps :label="$t('sales.actions.GO_TO_PAYMENT')" @click="goToPayment" />
                    </div>
                </q-card-section>
            </template>

            <!-- Step: Payment -->
            <SalePayment
                v-else-if="step === 'payment'"
                :total-value="totalValue"
                :payment="payment"
                :payment-types="paymentTypes"
                @update:payment="payment = $event"
                @back="step = 'items'"
                @review="goToConfirm"
            />

            <!-- Step: Confirm -->
            <SaleConfirm
                v-else-if="step === 'confirm'"
                :form="form"
                :items="form.items"
                :payment="payment"
                :saving="saving"
                :customers="allCustomers"
                :payment-types="paymentTypes"
                @confirm="confirmSale"
                @back="step = 'payment'"
            />

            <!-- Step: PDF -->
            <div v-else-if="step === 'pdf'" class="col">
                <PdfViewer
                    :pdf-content="pdfContent"
                    :title="$t('sales.pdf.TITLE', { id: savedSaleId })"
                    @close="onPdfClose"
                />
            </div>
        </q-card>
    </q-dialog>

    <!-- Quick new customer dialog -->
    <CustomerForm v-if="showNewCustomer" v-model="showNewCustomer" @saved="onCustomerSaved" />

    <!-- Inventory lock dialog -->
    <q-dialog v-model="showInventoryLockDialog">
        <q-card style="min-width: 320px">
            <q-card-section class="q-pb-none">
                <div class="text-h6" style="color: var(--text-primary)">{{ $t('sales.messages.INVENTORY_LOCK_TITLE') }}</div>
            </q-card-section>
            <q-separator class="q-mt-sm" />
            <q-card-section style="color: var(--text-primary)">{{ $t('sales.messages.INVENTORY_LOCK_BODY') }}</q-card-section>
            <q-card-actions align="right">
                <q-btn flat no-caps :label="$t('common.actions.CLOSE')" v-close-popup />
            </q-card-actions>
        </q-card>
    </q-dialog>
</template>

<script>
import SalePayment from './SalePayment.vue';
import SaleConfirm from './SaleConfirm.vue';
import PdfViewer from '../../../../components/PdfViewer.vue';
import CustomerForm from '../../customers/components/CustomerForm.vue';
import SaleService from '../../../../services/SaleService';
import CustomerService from '../../../../services/CustomerService';
import ProductService from '../../../../services/ProductService';
import PaymentTypeService from '../../../../services/PaymentTypeService';
import CompanySettingService from '../../../../services/CompanySettingService';
import { maskMoney, parseMoney } from '../../../../utils/Masks';
import { formatCurrency, formatDate } from '../../../../utils/Formatters';
import { saleSchema } from '../../../../schemas/SaleSchema';
import { toast } from 'vue3-toastify';
import { getToastTheme } from '../../../../plugins/toastify';

export default {
    name: 'SaleForm',

    components: { SalePayment, SaleConfirm, PdfViewer, CustomerForm },

    props: {
        modelValue: { type: Boolean, default: false },
    },

    emits: ['update:modelValue', 'saved'],

    data() {
        const today = new Date().toISOString().split('T')[0];

        return {
            step: 'items',
            form: {
                customerId: null,
                date: today,
                observation: '',
                items: [],
            },
            payment: {
                discountPercentage: 0,
                discountValue: 0,
                finalValue: 0,
                paymentForm: null,
                installments: [],
            },
            errors: {},
            saving: false,
            savedSaleId: null,
            pdfContent: null,
            showNewCustomer: false,
            showInventoryLockDialog: false,
            customerOptions: [],
            allCustomers: [],
            productOptions: [],
            allProducts: [],
            paymentTypes: [],
            allowNegativeStock: false,
            itemColumns: [
                { name: 'product', label: this.$t('sales.fields.PRODUCT'), field: 'product', align: 'left', headerStyle: 'width: 35%' },
                { name: 'measurementUnit', label: this.$t('sales.fields.MEASUREMENT_UNIT'), field: 'measurementUnit', align: 'center', headerStyle: 'width: 8%' },
                { name: 'stock', label: this.$t('sales.fields.CURRENT_STOCK'), field: 'stock', align: 'center', headerStyle: 'width: 10%' },
                { name: 'quantity', label: this.$t('sales.fields.QUANTITY') + ' *', field: 'quantity', align: 'center', headerStyle: 'width: 12%' },
                { name: 'unitPrice', label: this.$t('sales.fields.UNIT_PRICE') + ' *', field: 'unitPrice', align: 'center', headerStyle: 'width: 14%' },
                { name: 'subtotal', label: this.$t('sales.fields.SUBTOTAL'), field: 'subtotal', align: 'right', headerStyle: 'width: 12%' },
                { name: 'remove', label: '', field: 'remove', align: 'center', headerStyle: 'width: 5%' },
            ],
        };
    },

    computed: {
        totalValue() {
            return this.form.items.reduce((sum, item) => {
                if (item.unitPrice && item.quantity) {
                    return Math.round((sum + item.quantity * item.unitPrice) * 100) / 100;
                }
                return sum;
            }, 0);
        },
    },

    created() {
        this.loadCustomers();
        this.loadProducts();
        this.loadPaymentTypes();
        this.loadCompanySettings();
        this.addItem();
    },

    methods: {
        formatCurrency,
        formatDate,

        async loadCustomers() {
            try {
                const { data } = await CustomerService.findAll({ limit: 10000 });
                this.allCustomers = data.data.data.map((customer) => ({
                    label: `${customer.name}${customer.cpfCnpj ? ' — ' + customer.cpfCnpj : ''}`,
                    value: customer.id,
                    search: `${customer.name} ${customer.cpfCnpj || ''}`.toLowerCase(),
                }));
                this.customerOptions = this.allCustomers;
            } catch {
                // Handled by axios interceptor
            }
        },

        async loadProducts() {
            try {
                const { data } = await ProductService.findAll({ status: 'active', limit: 10000 });
                this.allProducts = data.data.data.map((product) => ({
                    label: `${product.name}${product.code ? ' — ' + product.code : ''}${product.type === 'product' ? ' — ' + Number(product.stock) + ' ' + (product.measurementUnit?.abbreviation || 'Un') : ''}`,
                    value: product.id,
                    search: `${product.name} ${product.code || ''} ${product.barcode || ''}`.toLowerCase(),
                    type: product.type,
                    measurementUnitAbbreviation: product.measurementUnit?.abbreviation || '',
                    stock: Number(product.stock),
                    salePrice: Number(product.salePrice),
                }));
                this.productOptions = this.allProducts;
            } catch {
                // Handled by axios interceptor
            }
        },

        async loadPaymentTypes() {
            try {
                const { data } = await PaymentTypeService.findAll({ status: 'active', limit: 1000 });
                this.paymentTypes = data.data.data.map((type) => ({
                    label: type.name,
                    value: type.id,
                }));
            } catch {
                // Handled by axios interceptor
            }
        },

        async loadCompanySettings() {
            try {
                const { data } = await CompanySettingService.findSettings();
                this.allowNegativeStock = data.data.allowNegativeStock;
            } catch {
                // Handled by axios interceptor
            }
        },

        filterCustomers(value, update) {
            if (!value) {
                update(() => { this.customerOptions = this.allCustomers; });
                return;
            }
            const needle = value.toLowerCase();
            update(() => {
                this.customerOptions = this.allCustomers.filter((c) => c.search.includes(needle));
            });
        },

        filterProducts(value, update) {
            if (!value) {
                update(() => { this.productOptions = this.allProducts; });
                return;
            }
            const needle = value.toLowerCase();
            update(() => {
                this.productOptions = this.allProducts.filter((p) => p.search.includes(needle));
            });
        },

        onProductSelected(index, productId) {
            const product = this.allProducts.find((p) => p.value === productId);
            if (!product) return;

            // Check if product is blocked by active inventory (via API on server side)
            // The API validates this on confirm; here we show an informational modal
            // when the inventory is locked (server returns the error later)

            this.form.items[index].measurementUnitAbbreviation = product.measurementUnitAbbreviation;
            this.form.items[index].productLabel = product.label;
            this.form.items[index].productType = product.type;
            this.form.items[index].stock = product.stock;
            this.form.items[index].unitPrice = product.salePrice;
            this.form.items[index].unitPriceDisplay = String(product.salePrice.toFixed(2));
            this.form.items[index].stockError = null;
        },

        onQuantityInput(index) {
            const item = this.form.items[index];
            if (!this.allowNegativeStock && item.productType === 'product' && item.quantity > item.stock) {
                item.stockError = 'sales.validations.INSUFFICIENT_STOCK_WARNING';
            } else {
                item.stockError = null;
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
                productType: null,
                measurementUnitAbbreviation: '',
                stock: null,
                quantity: null,
                unitPrice: null,
                unitPriceDisplay: '',
                stockError: null,
                index: Date.now(),
            });
        },

        removeItem(index) {
            this.form.items.splice(index, 1);
        },

        goToPayment() {
            this.errors = {};
            let hasError = false;

            if (!this.form.customerId) {
                this.errors.customerId = 'common.validations.REQUIRED_FIELD';
                hasError = true;
            }

            if (!this.form.date) {
                this.errors.date = 'common.validations.REQUIRED_FIELD';
                hasError = true;
            }

            if (this.form.items.length === 0) {
                toast.warning(this.$t('sales.validations.AT_LEAST_ONE_ITEM'), { theme: getToastTheme() });
                hasError = true;
            }

            for (const item of this.form.items) {
                if (!item.productId || !item.quantity || item.quantity <= 0 || !item.unitPrice || item.unitPrice <= 0) {
                    toast.warning(this.$t('sales.validations.INCOMPLETE_ITEMS'), { theme: getToastTheme() });
                    hasError = true;
                    break;
                }
                if (item.stockError) {
                    toast.warning(this.$t('sales.validations.STOCK_ERROR_EXISTS'), { theme: getToastTheme() });
                    hasError = true;
                    break;
                }
            }

            if (hasError) return;

            this.payment.finalValue = this.totalValue;
            this.step = 'payment';
        },

        goToConfirm() {
            this.step = 'confirm';
        },

        async confirmSale() {
            this.saving = true;

            try {
                const payload = saleSchema.parse({
                    customerId: this.form.customerId,
                    date: this.form.date,
                    observation: this.form.observation || undefined,
                    discountPercentage: this.payment.discountPercentage,
                    discountValue: this.payment.discountValue,
                    totalValue: this.totalValue,
                    finalValue: this.payment.finalValue,
                    paymentForm: this.payment.paymentForm,
                    items: this.form.items.map((item) => ({
                        productId: item.productId,
                        quantity: item.quantity,
                        unitPrice: item.unitPrice,
                    })),
                    installments: this.payment.installments.map((inst) => ({
                        paymentTypeId: inst.paymentTypeId,
                        value: inst.value,
                        dueDate: inst.dueDate,
                        paid: inst.paid ?? false,
                    })),
                });

                const { data } = await SaleService.create(payload);
                this.savedSaleId = data.data.id;
                this.pdfContent = this.buildPdfContent(data.data);
                this.step = 'pdf';
                this.$emit('saved');
            } finally {
                this.saving = false;
            }
        },

        buildPdfContent(sale) {
            const customerLabel = this.allCustomers.find((c) => c.value === this.form.customerId)?.label || '';
            const installmentsTable = this.payment.installments.map((inst, index) => {
                const paymentTypeLabel = this.paymentTypes.find((p) => p.value === inst.paymentTypeId)?.label || '';
                const total = this.payment.installments.length;
                return [
                    `${index + 1}/${total}`,
                    paymentTypeLabel,
                    formatCurrency(inst.value),
                    formatDate(inst.dueDate),
                ];
            });

            return {
                content: [
                    { text: `${this.$t('sales.pdf.TITLE', { id: this.savedSaleId })}`, style: 'header' },
                    { text: '\n' },
                    {
                        columns: [
                            { text: `${this.$t('sales.fields.CUSTOMER')}: ${customerLabel}` },
                            { text: `${this.$t('sales.fields.DATE')}: ${formatDate(this.form.date)}` },
                        ],
                    },
                    ...(this.form.observation ? [{ text: `${this.$t('sales.fields.OBSERVATION')}: ${this.form.observation}`, margin: [0, 4, 0, 0] }] : []),
                    { text: '\n' },
                    { text: this.$t('sales.sections.ITEMS'), style: 'subheader' },
                    {
                        table: {
                            headerRows: 1,
                            widths: ['*', 'auto', 'auto', 'auto', 'auto'],
                            body: [
                                [
                                    this.$t('sales.fields.PRODUCT'),
                                    this.$t('sales.fields.MEASUREMENT_UNIT'),
                                    this.$t('sales.fields.QUANTITY'),
                                    this.$t('sales.fields.UNIT_PRICE'),
                                    this.$t('sales.fields.SUBTOTAL'),
                                ],
                                ...this.form.items.map((item) => [
                                    item.productLabel,
                                    item.measurementUnitAbbreviation || '—',
                                    String(item.quantity),
                                    formatCurrency(item.unitPrice),
                                    formatCurrency(item.quantity * item.unitPrice),
                                ]),
                            ],
                        },
                        layout: 'lightHorizontalLines',
                    },
                    { text: `${this.$t('sales.fields.TOTAL_VALUE')}: ${formatCurrency(this.totalValue)}`, alignment: 'right', margin: [0, 4, 0, 0] },
                    ...(this.payment.discountValue > 0 ? [
                        { text: `${this.$t('sales.fields.DISCOUNT_PERCENTAGE')}: ${this.payment.discountPercentage}%`, alignment: 'right' },
                        { text: `${this.$t('sales.fields.DISCOUNT_VALUE')}: ${formatCurrency(this.payment.discountValue)}`, alignment: 'right' },
                    ] : []),
                    { text: `${this.$t('sales.fields.FINAL_VALUE')}: ${formatCurrency(this.payment.finalValue)}`, style: 'total', alignment: 'right' },
                    { text: '\n' },
                    { text: this.$t('sales.sections.PAYMENT'), style: 'subheader' },
                    { text: `${this.$t('sales.fields.PAYMENT_FORM')}: ${this.$t(`sales.paymentForms.${this.payment.paymentForm.toUpperCase()}`)}` },
                    {
                        table: {
                            headerRows: 1,
                            widths: ['auto', '*', 'auto', 'auto'],
                            body: [
                                [
                                    this.$t('sales.fields.INSTALLMENT'),
                                    this.$t('sales.fields.PAYMENT_TYPE'),
                                    this.$t('sales.fields.VALUE'),
                                    this.$t('sales.fields.DUE_DATE'),
                                ],
                                ...installmentsTable,
                            ],
                        },
                        layout: 'lightHorizontalLines',
                        margin: [0, 4, 0, 0],
                    },
                ],
                styles: {
                    header: { fontSize: 16, bold: true },
                    subheader: { fontSize: 12, bold: true, margin: [0, 8, 0, 4] },
                    total: { fontSize: 12, bold: true, margin: [0, 4, 0, 0] },
                },
            };
        },

        onPdfClose() {
            this.close();
        },

        openNewCustomer() {
            this.showNewCustomer = true;
        },

        async onCustomerSaved() {
            this.showNewCustomer = false;
            await this.loadCustomers();
        },

        close() {
            this.$emit('update:modelValue', false);
        },
    },
};
</script>
