<template>
    <q-dialog :model-value="modelValue" @update:model-value="$emit('update:modelValue', $event)" @escape-key="close">
        <q-card style="width: 480px; max-width: 90vw;" class="access-plan-form">
            <q-card-section class="row items-center q-pb-sm">
                <div class="text-h6" style="color: var(--text-primary)">
                    {{ isEditing ? $t('accessPlans.actions.EDIT') : $t('accessPlans.actions.CREATE') }}
                </div>
                <q-space />
                <q-btn flat round dense icon="close" @click="close" />
            </q-card-section>

            <q-separator />

            <q-card-section>
                <q-form @submit.prevent="handleSubmit" class="q-gutter-sm">
                    <q-input
                        v-model="form.title"
                        :label="$t('accessPlans.fields.TITLE')"
                        outlined
                        :error="!!errors.title"
                        :error-message="errors.title ? $t(errors.title) : ''"
                        @update:model-value="clearError('title')"
                    />

                    <q-input
                        v-model.number="form.userLimit"
                        :label="$t('accessPlans.fields.USER_LIMIT')"
                        type="number"
                        outlined
                        :error="!!errors.userLimit"
                        :error-message="errors.userLimit ? $t(errors.userLimit) : ''"
                        @update:model-value="clearError('userLimit')"
                    />

                    <q-input
                        v-model.number="form.durationDays"
                        :label="$t('accessPlans.fields.DURATION_DAYS')"
                        type="number"
                        outlined
                        :error="!!errors.durationDays"
                        :error-message="errors.durationDays ? $t(errors.durationDays) : ''"
                        @update:model-value="clearError('durationDays')"
                    />

                    <q-input
                        v-model.number="form.price"
                        :label="$t('accessPlans.fields.PRICE')"
                        type="number"
                        step="0.01"
                        prefix="R$"
                        outlined
                        :error="!!errors.price"
                        :error-message="errors.price ? $t(errors.price) : ''"
                        @update:model-value="clearError('price')"
                    />

                    <div class="row items-center q-mt-md">
                        <q-btn
                            v-if="isEditing"
                            flat
                            no-caps
                            dense
                            :color="plan?.status === 'active' ? 'negative' : 'positive'"
                            :icon="plan?.status === 'active' ? 'block' : 'check_circle'"
                            :label="plan?.status === 'active' ? $t('accessPlans.actions.INACTIVATE') : $t('accessPlans.actions.ACTIVATE')"
                            :loading="statusLoading"
                            @click="handleToggleStatus"
                        />

                        <q-space />

                        <q-btn
                            flat
                            no-caps
                            :label="$t('common.actions.CANCEL')"
                            @click="close"
                        />
                        <q-btn
                            type="submit"
                            color="primary"
                            no-caps
                            :label="$t('common.actions.SAVE')"
                            :loading="loading"
                        />
                    </div>
                </q-form>
            </q-card-section>
        </q-card>
    </q-dialog>
</template>

<script>
import { accessPlanSchema } from '../../../../schemas/AccessPlanSchema';
import AccessPlanService from '../../../../services/AccessPlanService';

export default {
    name: 'AccessPlanForm',

    props: {
        modelValue: { type: Boolean, default: false },
        plan: { type: Object, default: null },
    },

    emits: ['update:modelValue', 'saved'],

    data() {
        return {
            form: {
                title: '',
                userLimit: null,
                durationDays: null,
                price: null,
            },
            errors: {
                title: null,
                userLimit: null,
                durationDays: null,
                price: null,
            },
            loading: false,
            statusLoading: false,
        };
    },

    computed: {
        isEditing() {
            return !!this.plan;
        },
    },

    watch: {
        plan: {
            immediate: true,
            handler(value) {
                if (value) {
                    this.form = {
                        title: value.title,
                        userLimit: value.userLimit,
                        durationDays: value.durationDays,
                        price: parseFloat(value.price),
                    };
                } else {
                    this.resetForm();
                }
            },
        },
    },

    methods: {
        clearError(field) {
            this.errors[field] = null;
        },

        resetForm() {
            this.form = { title: '', userLimit: null, durationDays: null, price: null };
            this.errors = { title: null, userLimit: null, durationDays: null, price: null };
        },

        validate() {
            const result = accessPlanSchema.safeParse(this.form);

            if (result.success) {
                this.errors = { title: null, userLimit: null, durationDays: null, price: null };
                return true;
            }

            this.errors = { title: null, userLimit: null, durationDays: null, price: null };
            result.error.issues.forEach((issue) => {
                const field = issue.path[0];
                if (!this.errors[field]) {
                    this.errors[field] = issue.message;
                }
            });

            return false;
        },

        async handleSubmit() {
            if (!this.validate()) return;

            this.loading = true;

            try {
                if (this.isEditing) {
                    await AccessPlanService.update(this.plan.id, this.form);
                } else {
                    await AccessPlanService.create(this.form);
                }

                this.$emit('saved');
                this.close();
            } catch {
                // Handled by axios interceptor
            } finally {
                this.loading = false;
            }
        },

        async handleToggleStatus() {
            this.statusLoading = true;

            try {
                await AccessPlanService.toggleStatus(this.plan.id);
                this.$emit('saved');
                this.close();
            } catch {
                // Handled by axios interceptor
            } finally {
                this.statusLoading = false;
            }
        },

        close() {
            this.resetForm();
            this.$emit('update:modelValue', false);
        },
    },
};
</script>

<style scoped>
.access-plan-form {
    background-color: var(--bg-card);
    color: var(--text-primary);
}
</style>
