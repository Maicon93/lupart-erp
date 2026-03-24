<template>
    <q-dialog :model-value="modelValue" @update:model-value="$emit('update:modelValue', $event)" @escape-key="close">
        <q-card style="width: 600px; max-width: 90vw;" class="position-form">
            <q-card-section class="row items-center q-pb-sm">
                <div class="text-h6" style="color: var(--text-primary)">
                    {{ isEditing ? $t('positions.actions.EDIT') : $t('positions.actions.CREATE') }}
                </div>
                <q-space />
                <q-btn flat round dense icon="close" @click="close" />
            </q-card-section>

            <q-separator />

            <q-card-section>
                <q-form @submit.prevent="handleSubmit" class="q-gutter-sm">
                    <div class="row q-col-gutter-sm">
                        <div class="col-12">
                            <q-input
                                v-model="form.name"
                                :label="$t('positions.fields.NAME') + ' *'"
                                outlined
                                :error="!!errors.name"
                                :error-message="errors.name ? $t(errors.name) : ''"
                                @update:model-value="clearError('name')"
                            />
                        </div>
                    </div>

                    <div class="row q-col-gutter-sm">
                        <div class="col-12">
                            <div class="text-weight-medium q-mb-sm" style="color: var(--text-primary)">
                                {{ $t('positions.fields.PERMISSIONS') }} *
                            </div>

                            <q-input
                                v-model="permissionFilter"
                                :label="$t('common.actions.SEARCH')"
                                outlined
                                dense
                                clearable
                                class="q-mb-sm"
                            >
                                <template #prepend>
                                    <q-icon name="search" />
                                </template>
                            </q-input>

                            <div class="position-form__permissions-list">
                                <q-checkbox
                                    v-for="permission in filteredPermissions"
                                    :key="permission.id"
                                    v-model="form.permissions"
                                    :val="permission.id"
                                    :label="`${permission.name} — ${permission.observation}`"
                                    class="full-width"
                                />

                                <div
                                    v-if="filteredPermissions.length === 0"
                                    class="text-center q-pa-md"
                                    style="color: var(--text-secondary)"
                                >
                                    {{ $t('common.messages.NOT_FOUND') }}
                                </div>
                            </div>

                            <div v-if="errors.permissions" class="text-negative text-caption q-mt-xs">
                                {{ $t(errors.permissions) }}
                            </div>
                        </div>
                    </div>

                    <div class="row items-center q-mt-md">
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
import { positionSchema } from '../../../../schemas/PositionSchema';
import PositionService from '../../../../services/PositionService';
import PermissionService from '../../../../services/PermissionService';

export default {
    name: 'PositionForm',

    props: {
        modelValue: { type: Boolean, default: false },
        position: { type: Object, default: null },
    },

    emits: ['update:modelValue', 'saved'],

    data() {
        return {
            form: {
                name: '',
                permissions: [],
            },
            errors: {
                name: null,
                permissions: null,
            },
            loading: false,
            allPermissions: [],
            permissionFilter: '',
        };
    },

    computed: {
        isEditing() {
            return !!this.position;
        },

        filteredPermissions() {
            if (!this.permissionFilter) {
                return this.allPermissions;
            }
            const search = this.permissionFilter.toLowerCase();
            return this.allPermissions.filter(
                (permission) =>
                    permission.name.toLowerCase().includes(search) ||
                    (permission.observation && permission.observation.toLowerCase().includes(search)),
            );
        },
    },

    watch: {
        position: {
            immediate: true,
            handler(value) {
                if (value) {
                    this.form = {
                        name: value.name,
                        permissions: value.rolePermissions
                            ? value.rolePermissions.map((rolePermission) => rolePermission.permission.id)
                            : [],
                    };
                } else {
                    this.resetForm();
                }
            },
        },
    },

    created() {
        this.loadPermissions();
    },

    methods: {
        async loadPermissions() {
            try {
                const { data } = await PermissionService.findAll({ limit: 999 });
                this.allPermissions = data.data.data;
            } catch {
                // Handled by axios interceptor
            }
        },

        clearError(field) {
            this.errors[field] = null;
        },

        resetForm() {
            this.form = {
                name: '',
                permissions: [],
            };
            this.errors = {
                name: null,
                permissions: null,
            };
            this.permissionFilter = '';
        },

        validate() {
            const result = positionSchema.safeParse(this.form);

            if (result.success) {
                this.errors = { name: null, permissions: null };
                return true;
            }

            this.errors = { name: null, permissions: null };
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
                    await PositionService.update(this.position.id, this.form);
                } else {
                    await PositionService.create(this.form);
                }

                this.$emit('saved');
                this.close();
            } catch {
                // Handled by axios interceptor
            } finally {
                this.loading = false;
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
.position-form {
    background-color: var(--bg-card);
    color: var(--text-primary);
}

.position-form__permissions-list {
    max-height: 300px;
    overflow-y: auto;
    border: 1px solid var(--border-color);
    border-radius: 4px;
    padding: 8px;
}
</style>
