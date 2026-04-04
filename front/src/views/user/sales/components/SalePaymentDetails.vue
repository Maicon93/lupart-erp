<template>
    <q-dialog :model-value="modelValue" @update:model-value="$emit('update:modelValue', $event)">
        <q-card style="width: 700px; max-width: 90vw">
            <q-card-section>
                <div class="row items-center">
                    <div class="text-h6" style="color: var(--text-primary)">{{ $t('sales.actions.VIEW_PAYMENT') }}</div>
                    <q-space />
                    <q-btn flat round icon="close" v-close-popup />
                </div>
            </q-card-section>

            <q-separator />

            <q-card-section v-if="loading" class="text-center q-pa-xl">
                <q-spinner-dots size="40px" color="primary" />
            </q-card-section>

            <q-card-section v-else-if="paymentData">
                <div class="q-mb-md" style="color: var(--text-primary)">
                    {{ $t('sales.fields.PAYMENT_FORM') }}: <strong>{{ $t(`sales.paymentForms.${paymentData.paymentForm.toUpperCase()}`) }}</strong>
                </div>

                <q-table
                    :rows="paymentData.titles"
                    :columns="columns"
                    row-key="id"
                    flat
                    bordered
                    hide-pagination
                    :rows-per-page-options="[0]"
                >
                    <template #body-cell-installment="props">
                        <q-td :props="props" class="text-center">
                            {{ props.rowIndex + 1 }}/{{ paymentData.titles.length }}
                        </q-td>
                    </template>
                    <template #body-cell-paymentType="props">
                        <q-td :props="props">{{ props.row.paymentType?.name || '—' }}</q-td>
                    </template>
                    <template #body-cell-value="props">
                        <q-td :props="props" class="text-right">{{ formatCurrency(props.row.value) }}</q-td>
                    </template>
                    <template #body-cell-dueDate="props">
                        <q-td :props="props">{{ formatDate(props.row.dueDate) }}</q-td>
                    </template>
                    <template #body-cell-status="props">
                        <q-td :props="props">
                            <q-badge :color="statusColor(props.row)" :label="statusLabel(props.row)" />
                        </q-td>
                    </template>
                </q-table>
            </q-card-section>
        </q-card>
    </q-dialog>
</template>

<script>
import SaleService from '../../../../services/SaleService';
import { formatDate, formatCurrency } from '../../../../utils/Formatters';
import { FINANCIAL_TITLE_STATUS } from '../../../../utils/SaleConstants';

export default {
    name: 'SalePaymentDetails',

    props: {
        modelValue: { type: Boolean, default: false },
        saleId: { type: Number, default: null },
    },

    emits: ['update:modelValue'],

    data() {
        return {
            paymentData: null,
            loading: false,
            columns: [
                { name: 'installment', label: this.$t('sales.fields.INSTALLMENT'), field: 'installment', align: 'center' },
                { name: 'paymentType', label: this.$t('sales.fields.PAYMENT_TYPE'), field: 'paymentType', align: 'left' },
                { name: 'value', label: this.$t('sales.fields.VALUE'), field: 'value', align: 'right' },
                { name: 'dueDate', label: this.$t('sales.fields.DUE_DATE'), field: 'dueDate', align: 'left' },
                { name: 'status', label: this.$t('sales.fields.TITLE_STATUS'), field: 'status', align: 'center' },
            ],
        };
    },

    watch: {
        modelValue(value) {
            if (value && this.saleId) this.loadPayment();
        },
    },

    methods: {
        formatDate,
        formatCurrency,

        async loadPayment() {
            this.loading = true;
            this.paymentData = null;

            try {
                const { data } = await SaleService.findPayment(this.saleId);
                this.paymentData = data.data;
            } finally {
                this.loading = false;
            }
        },

        statusLabel(title) {
            if (title.status === FINANCIAL_TITLE_STATUS.PAID) return this.$t('sales.titleStatus.PAID');
            if (title.status === FINANCIAL_TITLE_STATUS.CANCELLED) return this.$t('sales.titleStatus.CANCELLED');
            const isOverdue = title.dueDate && new Date(title.dueDate) < new Date();
            if (isOverdue) return this.$t('sales.titleStatus.OVERDUE');
            return this.$t('sales.titleStatus.PENDING');
        },

        statusColor(title) {
            if (title.status === FINANCIAL_TITLE_STATUS.PAID) return 'positive';
            if (title.status === FINANCIAL_TITLE_STATUS.CANCELLED) return 'grey';
            const isOverdue = title.dueDate && new Date(title.dueDate) < new Date();
            return isOverdue ? 'negative' : 'warning';
        },
    },
};
</script>
