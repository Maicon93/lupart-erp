<template>
    <q-card-section class="col overflow-auto">
        <div class="text-subtitle1 text-weight-bold q-mb-md" style="color: var(--text-primary)">
            {{ $t('sales.sections.REVIEW') }}
        </div>

        <!-- Header info -->
        <div class="row q-col-gutter-sm q-mb-lg" style="max-width: 600px">
            <div class="col-12 col-sm-6">
                <div class="text-caption" style="color: var(--text-secondary)">{{ $t('sales.fields.CUSTOMER') }}</div>
                <div style="color: var(--text-primary)">{{ customerLabel }}</div>
            </div>
            <div class="col-12 col-sm-6">
                <div class="text-caption" style="color: var(--text-secondary)">{{ $t('sales.fields.DATE') }}</div>
                <div style="color: var(--text-primary)">{{ formatDate(form.date) }}</div>
            </div>
            <div v-if="form.observation" class="col-12">
                <div class="text-caption" style="color: var(--text-secondary)">{{ $t('sales.fields.OBSERVATION') }}</div>
                <div style="color: var(--text-primary)">{{ form.observation }}</div>
            </div>
        </div>

        <!-- Items table -->
        <div class="text-subtitle2 text-weight-medium q-mb-sm" style="color: var(--text-primary)">
            {{ $t('sales.sections.ITEMS') }}
        </div>

        <q-table
            :rows="items"
            :columns="itemColumns"
            row-key="index"
            flat
            bordered
            hide-pagination
            :rows-per-page-options="[0]"
        >
            <template #body-cell-product="props">
                <q-td :props="props">{{ props.row.productLabel }}</q-td>
            </template>
            <template #body-cell-measurementUnit="props">
                <q-td :props="props">{{ props.row.measurementUnitAbbreviation || '—' }}</q-td>
            </template>
            <template #body-cell-unitPrice="props">
                <q-td :props="props">{{ formatCurrency(props.row.unitPrice) }}</q-td>
            </template>
            <template #body-cell-subtotal="props">
                <q-td :props="props">{{ formatCurrency(props.row.quantity * props.row.unitPrice) }}</q-td>
            </template>
            <template #bottom>
                <div class="row full-width justify-end q-pa-sm">
                    <div style="color: var(--text-primary)">
                        <span>{{ $t('sales.fields.TOTAL_VALUE') }}: <strong>{{ formatCurrency(totalValue) }}</strong></span>
                        <template v-if="payment.discountValue > 0">
                            <span class="q-ml-md">{{ $t('sales.fields.DISCOUNT_PERCENTAGE') }}: <strong>{{ payment.discountPercentage }}%</strong></span>
                            <span class="q-ml-md">{{ $t('sales.fields.DISCOUNT_VALUE') }}: <strong>{{ formatCurrency(payment.discountValue) }}</strong></span>
                        </template>
                        <span class="q-ml-md">{{ $t('sales.fields.FINAL_VALUE') }}: <strong class="text-primary">{{ formatCurrency(payment.finalValue) }}</strong></span>
                    </div>
                </div>
            </template>
        </q-table>

        <!-- Payment section -->
        <div class="text-subtitle2 text-weight-medium q-mt-lg q-mb-sm" style="color: var(--text-primary)">
            {{ $t('sales.sections.PAYMENT') }}
        </div>

        <div class="q-mb-sm" style="color: var(--text-primary)">
            {{ $t('sales.fields.PAYMENT_FORM') }}: <strong>{{ $t(`sales.paymentForms.${payment.paymentForm.toUpperCase()}`) }}</strong>
        </div>

        <q-table
            :rows="payment.installments"
            :columns="installmentColumns"
            row-key="index"
            flat
            bordered
            hide-pagination
            :rows-per-page-options="[0]"
        >
            <template #body-cell-installment="props">
                <q-td :props="props" class="text-center">
                    {{ props.rowIndex + 1 }}/{{ payment.installments.length }}
                </q-td>
            </template>
            <template #body-cell-paymentType="props">
                <q-td :props="props">{{ getPaymentTypeLabel(props.row.paymentTypeId) }}</q-td>
            </template>
            <template #body-cell-value="props">
                <q-td :props="props" class="text-right">{{ formatCurrency(props.row.value) }}</q-td>
            </template>
            <template #body-cell-dueDate="props">
                <q-td :props="props">{{ formatDate(props.row.dueDate) }}</q-td>
            </template>
            <template #body-cell-paid="props">
                <q-td :props="props" class="text-center">
                    <q-badge :color="props.row.paid ? 'positive' : 'grey'" :label="props.row.paid ? $t('sales.fields.PAID') : $t('sales.fields.PENDING')" />
                </q-td>
            </template>
        </q-table>

        <div class="row justify-between q-mt-lg">
            <q-btn flat no-caps :label="$t('common.actions.BACK')" @click="$emit('back')" />
            <q-btn color="primary" no-caps :label="$t('common.actions.CONFIRM')" :loading="saving" @click="$emit('confirm')" />
        </div>
    </q-card-section>
</template>

<script>
import { formatCurrency, formatDate } from '../../../../utils/Formatters';

export default {
    name: 'SaleConfirm',

    props: {
        form: { type: Object, required: true },
        items: { type: Array, required: true },
        payment: { type: Object, required: true },
        saving: { type: Boolean, default: false },
        customers: { type: Array, default: () => [] },
        paymentTypes: { type: Array, default: () => [] },
    },

    emits: ['confirm', 'back'],

    data() {
        return {
            itemColumns: [
                { name: 'product', label: this.$t('sales.fields.PRODUCT'), field: 'productLabel', align: 'left' },
                { name: 'measurementUnit', label: this.$t('sales.fields.MEASUREMENT_UNIT'), field: 'measurementUnitAbbreviation', align: 'center' },
                { name: 'quantity', label: this.$t('sales.fields.QUANTITY'), field: 'quantity', align: 'right' },
                { name: 'unitPrice', label: this.$t('sales.fields.UNIT_PRICE'), field: 'unitPrice', align: 'right' },
                { name: 'subtotal', label: this.$t('sales.fields.SUBTOTAL'), field: 'subtotal', align: 'right' },
            ],
            installmentColumns: [
                { name: 'installment', label: this.$t('sales.fields.INSTALLMENT'), field: 'installment', align: 'center' },
                { name: 'paymentType', label: this.$t('sales.fields.PAYMENT_TYPE'), field: 'paymentTypeId', align: 'left' },
                { name: 'value', label: this.$t('sales.fields.VALUE'), field: 'value', align: 'right' },
                { name: 'dueDate', label: this.$t('sales.fields.DUE_DATE'), field: 'dueDate', align: 'left' },
                { name: 'paid', label: this.$t('sales.fields.PAID'), field: 'paid', align: 'center' },
            ],
        };
    },

    computed: {
        totalValue() {
            return this.items.reduce((sum, item) => {
                return Math.round((sum + (item.quantity || 0) * (item.unitPrice || 0)) * 100) / 100;
            }, 0);
        },

        customerLabel() {
            if (!this.customers?.length) return this.form.customerId;
            const customer = this.customers.find((c) => c.value === this.form.customerId);
            return customer?.label || this.form.customerId;
        },
    },

    methods: {
        formatCurrency,
        formatDate,

        getPaymentTypeLabel(paymentTypeId) {
            if (!this.paymentTypes?.length) return paymentTypeId;
            const type = this.paymentTypes.find((p) => p.value === paymentTypeId);
            return type?.label || paymentTypeId;
        },
    },
};
</script>
