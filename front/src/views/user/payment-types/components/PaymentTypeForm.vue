<template>
    <q-dialog :model-value="modelValue" @update:model-value="$emit('update:modelValue', $event)">
        <q-card style="width: 450px; max-width: 90vw">
            <q-card-section>
                <div class="text-h6" style="color: var(--text-primary)">
                    {{ isEditing ? $t('paymentTypes.actions.EDIT') : $t('paymentTypes.actions.CREATE') }}
                </div>
            </q-card-section>

            <q-separator />

            <q-card-section>
                <q-form @submit.prevent greedy>
                    <q-input
                        v-model="form.name"
                        :label="$t('paymentTypes.fields.NAME') + ' *'"
                        outlined
                        dense
                        hide-bottom-space
                        class="q-mb-sm"
                        :error="!!errors.name"
                        :error-message="errors.name ? $t(errors.name) : ''"
                    />

                    <q-input
                        v-model="form.observation"
                        :label="$t('paymentTypes.fields.OBSERVATION')"
                        outlined
                        dense
                        type="textarea"
                        rows="3"
                        class="q-mb-sm"
                    />

                    <div class="row items-center q-mt-md">
                        <q-btn
                            v-if="isEditing"
                            outline
                            no-caps
                            :label="paymentType?.status === 'active' ? $t('paymentTypes.actions.INACTIVATE') : $t('paymentTypes.actions.ACTIVATE')"
                            :color="paymentType?.status === 'active' ? 'negative' : 'positive'"
                            :loading="togglingStatus"
                            @click="toggleStatus"
                        />
                        <q-space />
                        <q-btn flat no-caps :label="$t('common.actions.CANCEL')" @click="close" />
                        <q-btn color="primary" no-caps :label="$t('common.actions.SAVE')" :loading="saving" @click="save" />
                    </div>
                </q-form>
            </q-card-section>
        </q-card>
    </q-dialog>
</template>

<script>
import PaymentTypeService from '../../../../services/PaymentTypeService';
import { paymentTypeSchema } from '../../../../schemas/PaymentTypeSchema';

export default {
    name: 'PaymentTypeForm',

    props: {
        modelValue: { type: Boolean, default: false },
        paymentType: { type: Object, default: null },
    },

    emits: ['update:modelValue', 'saved'],

    data() {
        return {
            form: {
                name: '',
                observation: '',
            },
            errors: {},
            saving: false,
            togglingStatus: false,
        };
    },

    computed: {
        isEditing() {
            return !!this.paymentType;
        },
    },

    watch: {
        paymentType: {
            immediate: true,
            handler(paymentType) {
                if (paymentType) {
                    this.form.name = paymentType.name || '';
                    this.form.observation = paymentType.observation || '';
                } else {
                    this.form.name = '';
                    this.form.observation = '';
                }
                this.errors = {};
            },
        },
    },

    methods: {
        async save() {
            this.errors = {};

            const result = paymentTypeSchema.safeParse(this.form);
            if (!result.success) {
                for (const issue of result.error.issues) {
                    this.errors[issue.path[0]] = issue.message;
                }
                return;
            }

            this.saving = true;

            try {
                if (this.isEditing) {
                    await PaymentTypeService.update(this.paymentType.id, this.form);
                } else {
                    await PaymentTypeService.create(this.form);
                }

                this.$emit('saved');
                this.close();
            } finally {
                this.saving = false;
            }
        },

        async toggleStatus() {
            this.togglingStatus = true;

            try {
                await PaymentTypeService.toggleStatus(this.paymentType.id);
                this.$emit('saved');
                this.close();
            } finally {
                this.togglingStatus = false;
            }
        },

        close() {
            this.$emit('update:modelValue', false);
        },
    },
};
</script>
