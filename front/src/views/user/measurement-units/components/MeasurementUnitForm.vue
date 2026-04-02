<template>
    <q-dialog :model-value="modelValue" @update:model-value="$emit('update:modelValue', $event)">
        <q-card style="min-width: 450px">
            <q-card-section>
                <div class="text-h6" style="color: var(--text-primary)">
                    {{ isEditing ? $t('measurementUnits.actions.EDIT') : $t('measurementUnits.actions.CREATE') }}
                </div>
            </q-card-section>

            <q-separator />

            <q-card-section>
                <q-form @submit.prevent greedy>
                    <q-input
                        v-model="form.abbreviation"
                        :label="$t('measurementUnits.fields.ABBREVIATION') + ' *'"
                        outlined
                        dense
                        maxlength="10"
                        class="q-mb-md"
                        :error="!!errors.abbreviation"
                        :error-message="errors.abbreviation ? $t(errors.abbreviation) : ''"
                    />

                    <q-input
                        v-model="form.description"
                        :label="$t('measurementUnits.fields.DESCRIPTION') + ' *'"
                        outlined
                        dense
                        class="q-mb-md"
                        :error="!!errors.description"
                        :error-message="errors.description ? $t(errors.description) : ''"
                    />

                    <div class="row items-center q-mt-md">
                        <q-btn
                            v-if="isEditing"
                            outline
                            no-caps
                            :label="measurementUnit?.status === 'active' ? $t('measurementUnits.actions.INACTIVATE') : $t('measurementUnits.actions.ACTIVATE')"
                            :color="measurementUnit?.status === 'active' ? 'negative' : 'positive'"
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
import MeasurementUnitService from '../../../../services/MeasurementUnitService';
import { measurementUnitSchema } from '../../../../schemas/MeasurementUnitSchema';

export default {
    name: 'MeasurementUnitForm',

    props: {
        modelValue: { type: Boolean, default: false },
        measurementUnit: { type: Object, default: null },
    },

    emits: ['update:modelValue', 'saved'],

    data() {
        return {
            form: {
                abbreviation: '',
                description: '',
            },
            errors: {},
            saving: false,
            togglingStatus: false,
        };
    },

    computed: {
        isEditing() {
            return !!this.measurementUnit;
        },
    },

    watch: {
        measurementUnit: {
            immediate: true,
            handler(unit) {
                if (unit) {
                    this.form.abbreviation = unit.abbreviation;
                    this.form.description = unit.description;
                } else {
                    this.form.abbreviation = '';
                    this.form.description = '';
                }
                this.errors = {};
            },
        },
    },

    methods: {
        async save() {
            this.errors = {};

            const result = measurementUnitSchema.safeParse(this.form);
            if (!result.success) {
                for (const issue of result.error.issues) {
                    this.errors[issue.path[0]] = issue.message;
                }
                return;
            }

            this.saving = true;

            try {
                if (this.isEditing) {
                    await MeasurementUnitService.update(this.measurementUnit.id, this.form);
                } else {
                    await MeasurementUnitService.create(this.form);
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
                await MeasurementUnitService.toggleStatus(this.measurementUnit.id);
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
