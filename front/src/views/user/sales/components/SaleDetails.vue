<template>
    <q-dialog :model-value="modelValue" @update:model-value="$emit('update:modelValue', $event)">
        <q-card style="width: 75vw; max-width: 75vw; height: 85vh; max-height: 85vh; display: flex; flex-direction: column">
            <q-card-section class="row items-center q-pb-none">
                <div class="text-h6" style="color: var(--text-primary)">
                    {{ $t('sales.actions.DETAILS') }} — #{{ sale?.id }}
                </div>
                <q-space />
                <q-btn flat round icon="close" @click="close" />
            </q-card-section>

            <q-separator class="q-mt-sm" />

            <q-card-section v-if="loading" class="text-center q-pa-xl">
                <q-spinner-dots size="40px" color="primary" />
            </q-card-section>

            <q-card-section v-else-if="sale" class="col overflow-auto">
                <!-- Header info -->
                <div class="row q-col-gutter-sm q-mb-lg">
                    <div class="col-12 col-sm-3">
                        <div class="text-caption" style="color: var(--text-secondary)">{{ $t('sales.fields.SALE_NUMBER') }}</div>
                        <div style="color: var(--text-primary)">#{{ sale.id }}</div>
                    </div>
                    <div class="col-12 col-sm-3">
                        <div class="text-caption" style="color: var(--text-secondary)">{{ $t('sales.fields.DATE') }}</div>
                        <div style="color: var(--text-primary)">{{ formatDate(sale.date) }}</div>
                    </div>
                    <div class="col-12 col-sm-3">
                        <div class="text-caption" style="color: var(--text-secondary)">{{ $t('sales.fields.CUSTOMER') }}</div>
                        <div style="color: var(--text-primary)">{{ sale.customer?.name || '—' }}</div>
                    </div>
                    <div class="col-12 col-sm-3">
                        <div class="text-caption" style="color: var(--text-secondary)">{{ $t('sales.fields.STATUS') }}</div>
                        <div>
                            <q-badge :color="sale.status === SALE_STATUS.FINALIZED ? 'positive' : 'negative'" :label="$t(`sales.status.${sale.status.toUpperCase()}`)" />
                        </div>
                    </div>
                    <div class="col-12 col-sm-3">
                        <div class="text-caption" style="color: var(--text-secondary)">{{ $t('sales.fields.RESPONSIBLE') }}</div>
                        <div style="color: var(--text-primary)">{{ sale.creator?.name || '—' }}</div>
                    </div>
                    <div v-if="sale.observation" class="col-12">
                        <div class="text-caption" style="color: var(--text-secondary)">{{ $t('sales.fields.OBSERVATION') }}</div>
                        <div style="color: var(--text-primary)">{{ sale.observation }}</div>
                    </div>

                    <!-- Financial summary -->
                    <div class="col-12">
                        <div class="row q-gutter-md">
                            <div>
                                <div class="text-caption" style="color: var(--text-secondary)">{{ $t('sales.fields.FINAL_VALUE') }}</div>
                                <div class="text-weight-bold text-primary">{{ formatCurrency(sale.finalValue) }}</div>
                            </div>
                            <div>
                                <div class="text-caption" style="color: var(--text-secondary)">{{ $t('sales.fields.PAID_VALUE') }}</div>
                                <div class="text-weight-bold text-positive">{{ formatCurrency(paidValue) }}</div>
                            </div>
                            <div>
                                <div class="text-caption" style="color: var(--text-secondary)">{{ $t('sales.fields.REMAINING_VALUE') }}</div>
                                <div class="text-weight-bold" :style="{ color: remainingValue > 0 ? 'var(--q-negative)' : 'var(--text-primary)' }">
                                    {{ formatCurrency(remainingValue) }}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Items table -->
                <q-table
                    :rows="sale.items || []"
                    :columns="itemColumns"
                    row-key="id"
                    flat
                    bordered
                    hide-pagination
                    :rows-per-page-options="[0]"
                >
                    <template #body-cell-product="props">
                        <q-td :props="props">{{ props.row.product?.name || '—' }}</q-td>
                    </template>
                    <template #body-cell-measurementUnit="props">
                        <q-td :props="props">{{ props.row.product?.measurementUnit?.abbreviation || '—' }}</q-td>
                    </template>
                    <template #body-cell-unitPrice="props">
                        <q-td :props="props" class="text-right">{{ formatCurrency(props.row.unitPrice) }}</q-td>
                    </template>
                    <template #body-cell-subtotal="props">
                        <q-td :props="props" class="text-right">{{ formatCurrency(props.row.subtotal) }}</q-td>
                    </template>
                    <template #bottom>
                        <div class="row full-width justify-end q-pa-sm" style="color: var(--text-primary)">
                            <span class="q-mr-lg">{{ $t('sales.fields.TOTAL_VALUE') }}: <strong>{{ formatCurrency(sale.totalValue) }}</strong></span>
                            <template v-if="Number(sale.discountValue) > 0">
                                <span class="q-mr-lg">{{ $t('sales.fields.DISCOUNT_PERCENTAGE') }}: <strong>{{ sale.discountPercentage }}%</strong></span>
                                <span class="q-mr-lg">{{ $t('sales.fields.DISCOUNT_VALUE') }}: <strong>{{ formatCurrency(sale.discountValue) }}</strong></span>
                            </template>
                            <span>{{ $t('sales.fields.FINAL_VALUE') }}: <strong class="text-primary">{{ formatCurrency(sale.finalValue) }}</strong></span>
                        </div>
                    </template>
                </q-table>

                <!-- Footer actions -->
                <div class="row q-gutter-sm q-mt-lg">
                    <q-btn flat no-caps :label="$t('sales.actions.VIEW_PAYMENT')" @click="showPaymentDetails = true" />
                    <q-btn flat no-caps :label="$t('sales.actions.VIEW_TITLES')" @click="goToTitles" />
                    <q-space />
                    <q-btn
                        v-if="sale.status === SALE_STATUS.FINALIZED"
                        outline
                        color="negative"
                        no-caps
                        :label="$t('sales.actions.CANCEL_SALE')"
                        @click="showCancelDialog = true"
                    />
                </div>
            </q-card-section>
        </q-card>
    </q-dialog>

    <!-- Payment details modal -->
    <SalePaymentDetails v-if="showPaymentDetails" v-model="showPaymentDetails" :sale-id="saleId" />

    <!-- Cancel dialog -->
    <q-dialog v-model="showCancelDialog">
        <q-card style="min-width: 420px; max-width: 90vw">
            <q-card-section class="q-pb-none">
                <div class="text-h6" style="color: var(--text-primary)">{{ $t('sales.actions.CANCEL_SALE') }}</div>
            </q-card-section>
            <q-separator class="q-mt-sm" />
            <q-card-section>
                <q-input
                    v-model="cancelReason"
                    :label="$t('sales.fields.CANCEL_REASON') + ' *'"
                    outlined
                    dense
                    type="textarea"
                    rows="3"
                    :error="!!cancelError"
                    :error-message="cancelError ? $t(cancelError) : ''"
                />
            </q-card-section>
            <q-card-actions align="right">
                <q-btn flat no-caps :label="$t('common.actions.CANCEL')" v-close-popup />
                <q-btn color="negative" no-caps :label="$t('sales.actions.CONFIRM_CANCEL')" :loading="cancelling" @click="cancelSale" />
            </q-card-actions>
        </q-card>
    </q-dialog>
</template>

<script>
import SalePaymentDetails from './SalePaymentDetails.vue';
import SaleService from '../../../../services/SaleService';
import { formatDate, formatCurrency } from '../../../../utils/Formatters';
import { SALE_STATUS, FINANCIAL_TITLE_STATUS } from '../../../../utils/SaleConstants';

export default {
    name: 'SaleDetails',

    components: { SalePaymentDetails },

    props: {
        modelValue: { type: Boolean, default: false },
        saleId: { type: Number, default: null },
    },

    emits: ['update:modelValue'],

    data() {
        return {
            sale: null,
            loading: false,
            showPaymentDetails: false,
            showCancelDialog: false,
            cancelReason: '',
            cancelError: null,
            cancelling: false,
            paidTitles: [],
            SALE_STATUS,
            FINANCIAL_TITLE_STATUS,
            itemColumns: [
                { name: 'product', label: this.$t('sales.fields.PRODUCT'), field: 'product', align: 'left' },
                { name: 'measurementUnit', label: this.$t('sales.fields.MEASUREMENT_UNIT'), field: 'measurementUnit', align: 'center' },
                { name: 'quantity', label: this.$t('sales.fields.QUANTITY'), field: 'quantity', align: 'right' },
                { name: 'unitPrice', label: this.$t('sales.fields.UNIT_PRICE'), field: 'unitPrice', align: 'right' },
                { name: 'subtotal', label: this.$t('sales.fields.SUBTOTAL'), field: 'subtotal', align: 'right' },
            ],
        };
    },

    computed: {
        paidValue() {
            if (!this.paidTitles?.length) return 0;
            return this.paidTitles
                .filter((title) => title.status === FINANCIAL_TITLE_STATUS.PAID)
                .reduce((sum, title) => Math.round((sum + Number(title.value)) * 100) / 100, 0);
        },

        remainingValue() {
            const remaining = Math.round((Number(this.sale?.finalValue || 0) - this.paidValue) * 100) / 100;
            return remaining > 0 ? remaining : 0;
        },
    },

    watch: {
        saleId: {
            immediate: true,
            handler(id) {
                if (id) this.loadSale(id);
            },
        },
    },

    methods: {
        formatDate,
        formatCurrency,

        async loadSale(id) {
            this.loading = true;

            try {
                const [saleResponse, paymentResponse] = await Promise.all([
                    SaleService.findById(id),
                    SaleService.findPayment(id),
                ]);

                this.sale = saleResponse.data.data;
                this.paidTitles = paymentResponse.data.data.titles || [];
            } finally {
                this.loading = false;
            }
        },

        goToTitles() {
            this.$router.push({ path: '/accounts-receivable', query: { type: 'inflow', reference_id: this.saleId } });
        },

        async cancelSale() {
            this.cancelError = null;

            if (!this.cancelReason.trim()) {
                this.cancelError = 'common.validations.REQUIRED_FIELD';
                return;
            }

            this.cancelling = true;

            try {
                await SaleService.cancel(this.saleId, { reason: this.cancelReason });
                this.showCancelDialog = false;
                await this.loadSale(this.saleId);
            } finally {
                this.cancelling = false;
            }
        },

        close() {
            this.$emit('update:modelValue', false);
        },
    },
};
</script>
