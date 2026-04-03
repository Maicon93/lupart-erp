<template>
    <q-card-section>
        <div class="text-subtitle1 text-weight-bold q-mb-md" style="color: var(--text-primary)">
            {{ $t('stockEntries.sections.REVIEW') }}
        </div>

        <div class="row q-col-gutter-sm q-mb-lg" style="max-width: 600px">
            <div v-if="supplierName" class="col-12 col-sm-6">
                <div class="text-caption" style="color: var(--text-secondary)">{{ $t('stockEntries.fields.SUPPLIER') }}</div>
                <div style="color: var(--text-primary)">{{ supplierName }}</div>
            </div>
            <div v-if="form.invoiceNumber" class="col-12 col-sm-6">
                <div class="text-caption" style="color: var(--text-secondary)">{{ $t('stockEntries.fields.INVOICE_NUMBER') }}</div>
                <div style="color: var(--text-primary)">{{ form.invoiceNumber }}</div>
            </div>
            <div v-if="form.observation" class="col-12">
                <div class="text-caption" style="color: var(--text-secondary)">{{ $t('stockEntries.fields.OBSERVATION') }}</div>
                <div style="color: var(--text-primary)">{{ form.observation }}</div>
            </div>
        </div>

        <q-table
            :rows="form.items"
            :columns="columns"
            row-key="index"
            flat
            bordered
            hide-pagination
            :rows-per-page-options="[0]"
        >
            <template #body-cell-unitPrice="props">
                <q-td :props="props">{{ props.row.unitPrice ? formatCurrency(props.row.unitPrice) : '—' }}</q-td>
            </template>
            <template #body-cell-subtotal="props">
                <q-td :props="props">
                    {{ props.row.unitPrice ? formatCurrency(props.row.quantity * props.row.unitPrice) : '—' }}
                </q-td>
            </template>
            <template #bottom>
                <div v-if="totalValue > 0" class="row full-width justify-end q-pa-sm">
                    <div class="text-weight-bold" style="color: var(--text-primary)">
                        {{ $t('stockEntries.fields.TOTAL_VALUE') }}: {{ formatCurrency(totalValue) }}
                    </div>
                </div>
            </template>
        </q-table>

        <div class="row justify-end q-gutter-sm q-mt-lg">
            <q-btn flat no-caps :label="$t('common.actions.BACK')" @click="$emit('back')" />
            <q-btn color="primary" no-caps :label="$t('common.actions.CONFIRM')" :loading="saving" @click="$emit('confirm')" />
        </div>
    </q-card-section>
</template>

<script>
import { formatDate, formatCurrency } from '../../../../utils/Formatters';

export default {
    name: 'StockEntryConfirm',

    props: {
        form: { type: Object, required: true },
        suppliers: { type: Array, default: () => [] },
        totalValue: { type: Number, default: 0 },
        saving: { type: Boolean, default: false },
    },

    emits: ['confirm', 'back'],

    data() {
        return {
            columns: [
                { name: 'product', label: this.$t('stockEntries.fields.PRODUCT'), field: 'productLabel', align: 'left' },
                { name: 'measurementUnit', label: this.$t('stockEntries.fields.MEASUREMENT_UNIT'), field: 'measurementUnitAbbreviation', align: 'left' },
                { name: 'quantity', label: this.$t('stockEntries.fields.QUANTITY'), field: 'quantity', align: 'right' },
                { name: 'unitPrice', label: this.$t('stockEntries.fields.UNIT_PRICE'), field: 'unitPrice', align: 'right' },
                { name: 'subtotal', label: this.$t('stockEntries.fields.SUBTOTAL'), field: 'subtotal', align: 'right' },
            ],
        };
    },

    computed: {
        supplierName() {
            if (!this.form.supplierId) return null;
            const supplier = this.suppliers.find((s) => s.value === this.form.supplierId);
            return supplier?.label || null;
        },
    },

    methods: {
        formatDate,
        formatCurrency,
    },
};
</script>
