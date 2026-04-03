<template>
    <q-dialog :model-value="modelValue" @update:model-value="$emit('update:modelValue', $event)">
        <q-card style="width: 90vw; max-width: 90vw; height: 90vh; max-height: 90vh">
            <q-card-section>
                <div class="row items-center">
                    <div class="text-h6" style="color: var(--text-primary)">
                        {{ $t('stockEntries.actions.DETAILS') }} — #{{ entry?.id }}
                    </div>
                    <q-space />
                    <q-btn flat round icon="close" @click="close" />
                </div>
            </q-card-section>

            <q-separator />

            <q-card-section v-if="loading" class="text-center q-pa-xl">
                <q-spinner-dots size="40px" color="primary" />
            </q-card-section>

            <q-card-section v-else-if="entry">
                <div class="row q-col-gutter-sm q-mb-lg" style="max-width: 600px">
                    <div class="col-12 col-sm-4">
                        <div class="text-caption" style="color: var(--text-secondary)">{{ $t('stockEntries.fields.ENTRY_NUMBER') }}</div>
                        <div style="color: var(--text-primary)">#{{ entry.id }}</div>
                    </div>
                    <div class="col-12 col-sm-4">
                        <div class="text-caption" style="color: var(--text-secondary)">{{ $t('stockEntries.fields.DATE') }}</div>
                        <div style="color: var(--text-primary)">{{ formatDate(entry.createdAt) }}</div>
                    </div>
                    <div v-if="entry.supplier" class="col-12 col-sm-4">
                        <div class="text-caption" style="color: var(--text-secondary)">{{ $t('stockEntries.fields.SUPPLIER') }}</div>
                        <div style="color: var(--text-primary)">{{ entry.supplier.name }}</div>
                    </div>
                    <div v-if="entry.invoiceNumber" class="col-12 col-sm-4">
                        <div class="text-caption" style="color: var(--text-secondary)">{{ $t('stockEntries.fields.INVOICE_NUMBER') }}</div>
                        <div style="color: var(--text-primary)">{{ entry.invoiceNumber }}</div>
                    </div>
                    <div class="col-12 col-sm-4">
                        <div class="text-caption" style="color: var(--text-secondary)">{{ $t('stockEntries.fields.RESPONSIBLE') }}</div>
                        <div style="color: var(--text-primary)">{{ entry.creator?.name }}</div>
                    </div>
                    <div v-if="entry.observation" class="col-12">
                        <div class="text-caption" style="color: var(--text-secondary)">{{ $t('stockEntries.fields.OBSERVATION') }}</div>
                        <div style="color: var(--text-primary)">{{ entry.observation }}</div>
                    </div>
                </div>

                <q-table
                    :rows="entry.items || []"
                    :columns="columns"
                    row-key="id"
                    flat
                    bordered
                    hide-pagination
                    :rows-per-page-options="[0]"
                >
                    <template #body-cell-product="props">
                        <q-td :props="props">{{ props.row.product?.name }}</q-td>
                    </template>
                    <template #body-cell-measurementUnit="props">
                        <q-td :props="props">{{ props.row.product?.measurementUnit?.abbreviation || '—' }}</q-td>
                    </template>
                    <template #body-cell-unitPrice="props">
                        <q-td :props="props">{{ props.row.unitPrice ? formatCurrency(props.row.unitPrice) : '—' }}</q-td>
                    </template>
                    <template #body-cell-subtotal="props">
                        <q-td :props="props">{{ props.row.subtotal ? formatCurrency(props.row.subtotal) : '—' }}</q-td>
                    </template>
                    <template #bottom>
                        <div v-if="entry.totalValue" class="row full-width justify-end q-pa-sm">
                            <div class="text-weight-bold" style="color: var(--text-primary)">
                                {{ $t('stockEntries.fields.TOTAL_VALUE') }}: {{ formatCurrency(entry.totalValue) }}
                            </div>
                        </div>
                    </template>
                </q-table>
            </q-card-section>
        </q-card>
    </q-dialog>
</template>

<script>
import StockEntryService from '../../../../services/StockEntryService';
import { formatDate, formatCurrency } from '../../../../utils/Formatters';

export default {
    name: 'StockEntryDetails',

    props: {
        modelValue: { type: Boolean, default: false },
        entryId: { type: Number, default: null },
    },

    emits: ['update:modelValue'],

    data() {
        return {
            entry: null,
            loading: false,
            columns: [
                { name: 'product', label: this.$t('stockEntries.fields.PRODUCT'), field: 'product', align: 'left' },
                { name: 'measurementUnit', label: this.$t('stockEntries.fields.MEASUREMENT_UNIT'), field: 'measurementUnit', align: 'left' },
                { name: 'quantity', label: this.$t('stockEntries.fields.QUANTITY'), field: 'quantity', align: 'right' },
                { name: 'unitPrice', label: this.$t('stockEntries.fields.UNIT_PRICE'), field: 'unitPrice', align: 'right' },
                { name: 'subtotal', label: this.$t('stockEntries.fields.SUBTOTAL'), field: 'subtotal', align: 'right' },
            ],
        };
    },

    watch: {
        entryId: {
            immediate: true,
            handler(id) {
                if (id) this.loadEntry(id);
            },
        },
    },

    methods: {
        formatDate,
        formatCurrency,

        async loadEntry(id) {
            this.loading = true;

            try {
                const { data } = await StockEntryService.findById(id);
                this.entry = data.data;
            } finally {
                this.loading = false;
            }
        },

        close() {
            this.$emit('update:modelValue', false);
        },
    },
};
</script>
