<template>
    <q-card-section class="col overflow-auto">
        <div class="text-subtitle1 text-weight-bold q-mb-md" style="color: var(--text-primary)">
            {{ $t('sales.sections.PAYMENT') }}
        </div>

        <div class="row q-mb-sm">
            <div class="text-body1" style="color: var(--text-secondary)">
                {{ $t('sales.fields.TOTAL_VALUE') }}:
                <span class="text-weight-bold" style="color: var(--text-primary)">{{ formatCurrency(totalValue) }}</span>
            </div>
        </div>

        <!-- Discount -->
        <div class="row q-col-gutter-sm q-mb-lg" style="max-width: 480px">
            <div class="col-12">
                <div class="text-caption text-weight-medium q-mb-xs" style="color: var(--text-secondary)">
                    {{ $t('sales.sections.DISCOUNT') }}
                </div>
            </div>
            <div class="col-6">
                <q-input
                    :model-value="localDiscountPercentage"
                    :label="$t('sales.fields.DISCOUNT_PERCENTAGE')"
                    type="number"
                    outlined
                    dense
                    suffix="%"
                    hide-bottom-space
                    @update:model-value="onDiscountPercentageInput($event)"
                />
            </div>
            <div class="col-6">
                <q-input
                    :model-value="localDiscountValueDisplay"
                    :label="$t('sales.fields.DISCOUNT_VALUE')"
                    outlined
                    dense
                    prefix="R$"
                    hide-bottom-space
                    @update:model-value="onDiscountValueInput($event)"
                />
            </div>
            <div class="col-12">
                <div class="text-body2" style="color: var(--text-primary)">
                    {{ $t('sales.fields.FINAL_VALUE') }}:
                    <span class="text-weight-bold text-primary">{{ formatCurrency(finalValue) }}</span>
                </div>
            </div>
        </div>

        <!-- Payment form -->
        <div class="q-mb-md">
            <div class="text-caption text-weight-medium q-mb-xs" style="color: var(--text-secondary)">
                {{ $t('sales.fields.PAYMENT_FORM') + ' *' }}
            </div>
            <q-option-group
                v-model="localPaymentForm"
                :options="paymentFormOptions"
                color="primary"
                inline
                @update:model-value="onPaymentFormChange"
            />
        </div>

        <!-- Installments grid -->
        <template v-if="localPaymentForm">
            <q-table
                :rows="localInstallments"
                :columns="installmentColumns"
                row-key="index"
                flat
                bordered
                hide-pagination
                :rows-per-page-options="[0]"
            >
                <template #body="props">
                    <q-tr :props="props">
                        <q-td key="installment" :props="props" class="text-center" style="color: var(--text-secondary)">
                            {{ props.rowIndex + 1 }}/{{ localInstallments.length }}
                        </q-td>
                        <q-td key="paymentType" :props="props">
                            <q-select
                                v-model="props.row.paymentTypeId"
                                :options="paymentTypes"
                                :placeholder="$t('sales.placeholders.SELECT_PAYMENT_TYPE')"
                                outlined
                                dense
                                emit-value
                                map-options
                                hide-bottom-space
                                @update:model-value="emitPayment"
                            />
                        </q-td>
                        <q-td key="value" :props="props">
                            <q-input
                                :model-value="props.row.valueDisplay"
                                outlined
                                dense
                                prefix="R$"
                                hide-bottom-space
                                @update:model-value="onInstallmentValueInput(props.rowIndex, $event)"
                            />
                        </q-td>
                        <q-td key="dueDate" :props="props">
                            <q-input
                                v-model="props.row.dueDate"
                                type="date"
                                outlined
                                dense
                                hide-bottom-space
                                @update:model-value="emitPayment"
                            />
                        </q-td>
                        <q-td key="paid" :props="props" class="text-center">
                            <q-checkbox
                                v-model="props.row.paid"
                                :disable="localPaymentForm === 'cash'"
                                color="positive"
                                @update:model-value="emitPayment"
                            />
                        </q-td>
                        <q-td key="remove" :props="props" class="text-center">
                            <q-btn
                                v-if="localPaymentForm === 'installment'"
                                flat round icon="delete" size="sm" color="negative"
                                @click="removeInstallment(props.rowIndex)"
                            />
                        </q-td>
                    </q-tr>
                </template>

                <template #bottom>
                    <div class="row full-width items-center justify-between q-pa-sm">
                        <q-btn
                            v-if="localPaymentForm === 'installment'"
                            flat no-caps icon="add"
                            :label="$t('sales.actions.ADD_INSTALLMENT')"
                            color="primary"
                            size="sm"
                            @click="addInstallment"
                        />
                        <q-space />
                        <div class="text-right">
                            <div class="text-weight-bold" style="color: var(--text-primary)">
                                {{ $t('sales.fields.INSTALLMENTS_TOTAL') }}: {{ formatCurrency(installmentsTotal) }}
                            </div>
                            <div v-if="installmentsDiff > 0" class="text-negative text-caption">
                                {{ $t('sales.messages.INSTALLMENTS_SHORT', { value: formatCurrency(installmentsDiff) }) }}
                            </div>
                            <div v-else-if="installmentsDiff < 0" class="text-negative text-caption">
                                {{ $t('sales.messages.INSTALLMENTS_EXCEED', { value: formatCurrency(Math.abs(installmentsDiff)) }) }}
                            </div>
                        </div>
                    </div>
                </template>
            </q-table>
        </template>

        <div class="row justify-between q-mt-lg">
            <q-btn flat no-caps :label="$t('common.actions.BACK')" @click="$emit('back')" />
            <q-btn
                color="primary"
                no-caps
                :label="$t('sales.actions.REVIEW')"
                :disable="!canReview"
                @click="$emit('review')"
            />
        </div>
    </q-card-section>
</template>

<script>
import { maskMoney, parseMoney } from '../../../../utils/Masks';
import { formatCurrency } from '../../../../utils/Formatters';

export default {
    name: 'SalePayment',

    props: {
        totalValue: { type: Number, required: true },
        payment: { type: Object, required: true },
        paymentTypes: { type: Array, default: () => [] },
    },

    emits: ['update:payment', 'back', 'review'],

    data() {
        return {
            localDiscountPercentage: 0,
            localDiscountValueDisplay: '0,00',
            localPaymentForm: null,
            localInstallments: [],
            lastEditedDiscount: null,
            paymentFormOptions: [
                { label: this.$t('sales.paymentForms.CASH'), value: 'cash' },
                { label: this.$t('sales.paymentForms.INSTALLMENT'), value: 'installment' },
            ],
            installmentColumns: [
                { name: 'installment', label: this.$t('sales.fields.INSTALLMENT'), field: 'installment', align: 'center', headerStyle: 'width: 7%' },
                { name: 'paymentType', label: this.$t('sales.fields.PAYMENT_TYPE') + ' *', field: 'paymentType', align: 'left', headerStyle: 'width: 30%' },
                { name: 'value', label: this.$t('sales.fields.VALUE') + ' *', field: 'value', align: 'center', headerStyle: 'width: 18%' },
                { name: 'dueDate', label: this.$t('sales.fields.DUE_DATE') + ' *', field: 'dueDate', align: 'center', headerStyle: 'width: 22%' },
                { name: 'paid', label: this.$t('sales.fields.PAID'), field: 'paid', align: 'center', headerStyle: 'width: 10%' },
                { name: 'remove', label: '', field: 'remove', align: 'center', headerStyle: 'width: 5%' },
            ],
        };
    },

    computed: {
        finalValue() {
            const discount = parseMoney(this.localDiscountValueDisplay) || 0;
            const result = Math.round((this.totalValue - discount) * 100) / 100;
            return result > 0 ? result : 0;
        },

        installmentsTotal() {
            return this.localInstallments.reduce((sum, inst) => {
                return Math.round((sum + (parseMoney(inst.valueDisplay) || 0)) * 100) / 100;
            }, 0);
        },

        installmentsDiff() {
            return Math.round((this.finalValue - this.installmentsTotal) * 100) / 100;
        },

        canReview() {
            if (!this.localPaymentForm) return false;
            if (this.installmentsDiff !== 0) return false;
            return this.localInstallments.every((inst) => inst.paymentTypeId && inst.dueDate && parseMoney(inst.valueDisplay) > 0);
        },
    },

    watch: {
        finalValue(value) {
            this.emitPayment();
            if (this.localInstallments.length > 0) {
                this.redistributeInstallments(value);
            }
        },
    },

    created() {
        this.localDiscountPercentage = this.payment.discountPercentage || 0;
        this.localDiscountValueDisplay = String((this.payment.discountValue || 0).toFixed(2)).replace('.', ',');
        this.localPaymentForm = this.payment.paymentForm || null;
        if (this.payment.installments?.length > 0) {
            this.localInstallments = this.payment.installments.map((inst) => ({
                ...inst,
                valueDisplay: String((inst.value || 0).toFixed(2)).replace('.', ','),
            }));
        }
    },

    methods: {
        formatCurrency,

        onDiscountPercentageInput(value) {
            this.lastEditedDiscount = 'percentage';
            const percentage = Math.min(Math.max(parseFloat(value) || 0, 0), 100);
            this.localDiscountPercentage = percentage;
            const discountValue = Math.round((this.totalValue * (percentage / 100)) * 100) / 100;
            this.localDiscountValueDisplay = String(discountValue.toFixed(2)).replace('.', ',');
            this.resetToCash();
        },

        onDiscountValueInput(value) {
            this.lastEditedDiscount = 'value';
            const masked = maskMoney(value);
            this.localDiscountValueDisplay = masked;
            const discountValue = parseMoney(masked) || 0;
            const percentage = this.totalValue > 0 ? Math.round((discountValue / this.totalValue) * 10000) / 100 : 0;
            this.localDiscountPercentage = percentage;
            this.resetToCash();
        },

        resetToCash() {
            this.localPaymentForm = 'cash';
            this.localInstallments = [];
            this.addInstallment();
        },

        onPaymentFormChange() {
            this.localInstallments = [];
            this.addInstallment();
            this.emitPayment();
        },

        addInstallment() {
            const isCash = this.localPaymentForm === 'cash';
            this.localInstallments.push({
                paymentTypeId: null,
                value: 0,
                valueDisplay: '0,00',
                dueDate: '',
                paid: isCash,
                index: Date.now(),
            });
            this.redistributeInstallments(this.finalValue);
            this.emitPayment();
        },

        removeInstallment(index) {
            this.localInstallments.splice(index, 1);
            this.redistributeInstallments(this.finalValue);
            this.emitPayment();
        },

        redistributeInstallments(total) {
            const count = this.localInstallments.length;
            if (count === 0) return;

            const base = Math.floor((total / count) * 100) / 100;
            const remainder = Math.round((total - base * count) * 100) / 100;

            this.localInstallments.forEach((inst, index) => {
                const value = index === count - 1 ? Math.round((base + remainder) * 100) / 100 : base;
                inst.value = value;
                inst.valueDisplay = String(value.toFixed(2)).replace('.', ',');
            });

            this.emitPayment();
        },

        onInstallmentValueInput(index, value) {
            const masked = maskMoney(value);
            this.localInstallments[index].valueDisplay = masked;
            this.localInstallments[index].value = parseMoney(masked) || 0;

            const remaining = this.localInstallments.slice(index + 1);
            if (remaining.length > 0) {
                const sumBefore = this.localInstallments
                    .slice(0, index + 1)
                    .reduce((sum, inst) => Math.round((sum + (parseMoney(inst.valueDisplay) || 0)) * 100) / 100, 0);
                const toDistribute = Math.round((this.finalValue - sumBefore) * 100) / 100;
                const count = remaining.length;
                const base = Math.floor((toDistribute / count) * 100) / 100;
                const remainder = Math.round((toDistribute - base * count) * 100) / 100;

                remaining.forEach((inst, i) => {
                    const instValue = i === count - 1 ? Math.round((base + remainder) * 100) / 100 : base;
                    inst.value = instValue;
                    inst.valueDisplay = String(instValue.toFixed(2)).replace('.', ',');
                });
            }

            this.emitPayment();
        },

        emitPayment() {
            this.$emit('update:payment', {
                discountPercentage: this.localDiscountPercentage,
                discountValue: parseMoney(this.localDiscountValueDisplay) || 0,
                finalValue: this.finalValue,
                paymentForm: this.localPaymentForm,
                installments: this.localInstallments.map((inst) => ({
                    paymentTypeId: inst.paymentTypeId,
                    value: parseMoney(inst.valueDisplay) || 0,
                    dueDate: inst.dueDate,
                    paid: inst.paid ?? false,
                })),
            });
        },
    },
};
</script>
