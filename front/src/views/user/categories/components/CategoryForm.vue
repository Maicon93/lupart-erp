<template>
    <q-dialog :model-value="modelValue" @update:model-value="$emit('update:modelValue', $event)">
        <q-card style="width: 450px; max-width: 90vw">
            <q-card-section>
                <div class="text-h6" style="color: var(--text-primary)">
                    {{ isEditing ? $t('categories.actions.EDIT') : $t('categories.actions.CREATE') }}
                </div>
            </q-card-section>

            <q-separator />

            <q-card-section>
                <q-form @submit.prevent greedy>
                    <q-input
                        v-model="form.name"
                        :label="$t('categories.fields.NAME') + ' *'"
                        outlined
                        dense
                        hide-bottom-space
                        class="q-mb-sm"
                        :error="!!errors.name"
                        :error-message="errors.name ? $t(errors.name) : ''"
                    />

                    <q-input
                        v-model="form.observation"
                        :label="$t('categories.fields.OBSERVATION')"
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
                            :label="category?.status === 'active' ? $t('categories.actions.INACTIVATE') : $t('categories.actions.ACTIVATE')"
                            :color="category?.status === 'active' ? 'negative' : 'positive'"
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
import CategoryService from '../../../../services/CategoryService';
import { categorySchema } from '../../../../schemas/CategorySchema';

export default {
    name: 'CategoryForm',

    props: {
        modelValue: { type: Boolean, default: false },
        category: { type: Object, default: null },
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
            return !!this.category;
        },
    },

    watch: {
        category: {
            immediate: true,
            handler(category) {
                if (category) {
                    this.form.name = category.name || '';
                    this.form.observation = category.observation || '';
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

            const result = categorySchema.safeParse(this.form);
            if (!result.success) {
                for (const issue of result.error.issues) {
                    this.errors[issue.path[0]] = issue.message;
                }
                return;
            }

            this.saving = true;

            try {
                if (this.isEditing) {
                    await CategoryService.update(this.category.id, this.form);
                } else {
                    await CategoryService.create(this.form);
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
                await CategoryService.toggleStatus(this.category.id);
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
