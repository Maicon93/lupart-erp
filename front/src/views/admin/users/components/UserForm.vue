<template>
    <q-dialog :model-value="modelValue" @update:model-value="$emit('update:modelValue', $event)" @escape-key="close">
        <q-card style="width: 600px; max-width: 90vw;" class="user-form">
            <q-card-section class="row items-center q-pb-sm">
                <div class="text-h6" style="color: var(--text-primary)">
                    {{ isEditing ? $t('users.actions.EDIT') : $t('users.actions.CREATE') }}
                </div>
                <q-space />
                <q-btn flat round dense icon="close" @click="close" />
            </q-card-section>

            <q-separator />

            <q-card-section>
                <q-form @submit.prevent greedy class="q-gutter-sm">
                    <div class="row q-col-gutter-sm">
                        <div class="col-12">
                            <q-input
                                v-model="form.name"
                                :label="$t('users.fields.NAME') + ' *'"
                                outlined
                                :error="!!errors.name"
                                :error-message="errors.name ? $t(errors.name) : ''"
                                @update:model-value="clearError('name')"
                            />
                        </div>
                    </div>

                    <div class="row q-col-gutter-sm">
                        <div class="col-12">
                            <q-input
                                v-model="form.email"
                                :label="$t('users.fields.EMAIL') + ' *'"
                                outlined
                                :error="!!errors.email"
                                :error-message="errors.email ? $t(errors.email) : ''"
                                @update:model-value="clearError('email')"
                            />
                        </div>
                    </div>

                    <div v-if="!isEditing || showPasswordFields" class="row q-col-gutter-sm">
                        <div class="col-12 col-sm-6">
                            <q-input
                                v-model="form.password"
                                :label="$t('users.fields.PASSWORD') + ' *'"
                                outlined
                                :type="showPassword ? 'text' : 'password'"
                                :error="!!errors.password"
                                :error-message="errors.password ? $t(errors.password) : ''"
                                @update:model-value="clearError('password')"
                            >
                                <template #append>
                                    <q-icon
                                        :name="showPassword ? 'visibility_off' : 'visibility'"
                                        class="cursor-pointer"
                                        @click="showPassword = !showPassword"
                                    />
                                </template>
                            </q-input>
                        </div>
                        <div class="col-12 col-sm-6">
                            <q-input
                                v-model="form.confirmPassword"
                                :label="$t('users.fields.CONFIRM_PASSWORD') + ' *'"
                                outlined
                                :type="showConfirmPassword ? 'text' : 'password'"
                                :error="!!errors.confirmPassword"
                                :error-message="errors.confirmPassword ? $t(errors.confirmPassword) : ''"
                                @update:model-value="clearError('confirmPassword')"
                            >
                                <template #append>
                                    <q-icon
                                        :name="showConfirmPassword ? 'visibility_off' : 'visibility'"
                                        class="cursor-pointer"
                                        @click="showConfirmPassword = !showConfirmPassword"
                                    />
                                </template>
                            </q-input>
                        </div>
                    </div>

                    <div v-if="isEditing && !showPasswordFields" class="row q-col-gutter-sm">
                        <div class="col-12">
                            <q-checkbox
                                v-model="showPasswordFields"
                                :label="$t('users.actions.CHANGE_PASSWORD')"
                            />
                        </div>
                    </div>

                    <div class="row q-col-gutter-sm">
                        <div class="col-12 col-sm-6">
                            <q-input
                                v-model="form.phone"
                                :label="$t('users.fields.PHONE') + ' *'"
                                outlined
                                mask="(##) #####-####"
                                :error="!!errors.phone"
                                :error-message="errors.phone ? $t(errors.phone) : ''"
                                @update:model-value="clearError('phone')"
                            />
                        </div>
                        <div class="col-12 col-sm-6">
                            <q-select
                                v-model="form.country"
                                :options="countryOptions"
                                :label="$t('users.fields.COUNTRY') + ' *'"
                                outlined
                                emit-value
                                map-options
                                :error="!!errors.country"
                                :error-message="errors.country ? $t(errors.country) : ''"
                                @update:model-value="clearError('country')"
                            />
                        </div>
                    </div>

                    <div class="row q-col-gutter-sm">
                        <div class="col-12 col-sm-6">
                            <q-select
                                v-model="form.language"
                                :options="languageOptions"
                                :label="$t('users.fields.LANGUAGE') + ' *'"
                                outlined
                                emit-value
                                map-options
                                :error="!!errors.language"
                                :error-message="errors.language ? $t(errors.language) : ''"
                                @update:model-value="clearError('language')"
                            />
                        </div>
                        <div class="col-12 col-sm-6">
                            <q-select
                                v-model="form.roleId"
                                :options="roles"
                                :label="$t('users.fields.ROLE') + ' *'"
                                outlined
                                emit-value
                                map-options
                                option-value="id"
                                option-label="name"
                                :error="!!errors.roleId"
                                :error-message="errors.roleId ? $t(errors.roleId) : ''"
                                @update:model-value="clearError('roleId')"
                            />
                        </div>
                    </div>

                    <div v-if="isUserRole" class="row q-col-gutter-sm">
                        <div class="col-12">
                            <q-select
                                v-model="form.companyIds"
                                :options="companies"
                                :label="$t('users.fields.COMPANIES')"
                                outlined
                                multiple
                                use-chips
                                emit-value
                                map-options
                                option-value="id"
                                option-label="name"
                                :hint="$t('users.hints.COMPANIES_OPTIONAL')"
                                :error="!!errors.companyIds"
                                :error-message="errors.companyIds ? $t(errors.companyIds) : ''"
                                @update:model-value="clearError('companyIds')"
                            />
                        </div>
                    </div>

                    <div class="row items-center q-mt-md">
                        <q-btn
                            v-if="isEditing"
                            outline
                            no-caps
                            :color="user?.status === 'active' ? 'negative' : 'positive'"
                            :label="user?.status === 'active' ? $t('users.actions.INACTIVATE') : $t('users.actions.ACTIVATE')"
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
                            color="primary"
                            no-caps
                            :label="$t('common.actions.SAVE')"
                            @click="handleSubmit"
                            :loading="loading"
                        />
                    </div>
                </q-form>
            </q-card-section>
        </q-card>
    </q-dialog>
</template>

<script>
import { createUserSchema, updateUserSchema } from '../../../../schemas/UserSchema';
import UserService from '../../../../services/UserService';
import CompanyService from '../../../../services/CompanyService';

export default {
    name: 'UserForm',

    props: {
        modelValue: { type: Boolean, default: false },
        user: { type: Object, default: null },
    },

    emits: ['update:modelValue', 'saved'],

    data() {
        return {
            form: {
                name: '',
                email: '',
                password: '',
                confirmPassword: '',
                phone: '',
                country: '',
                language: '',
                roleId: null,
                companyIds: [],
            },
            errors: {
                name: null,
                email: null,
                password: null,
                confirmPassword: null,
                phone: null,
                country: null,
                language: null,
                roleId: null,
                companyIds: null,
            },
            loading: false,
            statusLoading: false,
            showPasswordFields: false,
            showPassword: false,
            showConfirmPassword: false,
            companies: [],
            roles: [],
            countryOptions: [
                { label: this.$t('users.countries.BRAZIL'), value: 'Brasil' },
                { label: this.$t('users.countries.USA'), value: 'Estados Unidos' },
                { label: this.$t('users.countries.PORTUGAL'), value: 'Portugal' },
                { label: this.$t('users.countries.OTHER'), value: 'Outro' },
            ],
            languageOptions: [
                { label: this.$t('users.languages.PT_BR'), value: 'pt-BR' },
                { label: this.$t('users.languages.EN'), value: 'en' },
            ],
        };
    },

    computed: {
        isEditing() {
            return !!this.user;
        },

        isUserRole() {
            if (!this.form.roleId || this.roles.length === 0) return false;
            const selectedRole = this.roles.find((role) => role.id === this.form.roleId);
            return selectedRole?.name === 'user';
        },
    },

    watch: {
        user: {
            immediate: true,
            handler(value) {
                if (value) {
                    this.form = {
                        name: value.name,
                        email: value.email,
                        password: '',
                        confirmPassword: '',
                        phone: value.phone || '',
                        country: value.country || '',
                        language: value.language || '',
                        roleId: value.roleId || value.role?.id || null,
                        companyIds: value.companyIds || [],
                    };
                    this.showPasswordFields = false;
                } else {
                    this.resetForm();
                }
            },
        },
    },

    created() {
        this.loadCompanies();
        this.loadRoles();
    },

    methods: {
        async loadCompanies() {
            try {
                const { data } = await CompanyService.findAllActive();
                this.companies = data.data;
            } catch {
                // Handled by axios interceptor
            }
        },

        async loadRoles() {
            try {
                const { data } = await UserService.findGlobalRoles();
                this.roles = data.data;
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
                email: '',
                password: '',
                confirmPassword: '',
                phone: '',
                country: '',
                language: '',
                roleId: null,
                companyIds: [],
            };
            this.errors = {
                name: null,
                email: null,
                password: null,
                confirmPassword: null,
                phone: null,
                country: null,
                language: null,
                roleId: null,
                companyIds: null,
            };
            this.showPasswordFields = false;
            this.showPassword = false;
            this.showConfirmPassword = false;
        },

        validate() {
            const schema = this.isEditing ? updateUserSchema : createUserSchema;
            const result = schema.safeParse(this.form);

            const cleanErrors = {
                name: null,
                email: null,
                password: null,
                confirmPassword: null,
                phone: null,
                country: null,
                language: null,
                roleId: null,
                companyIds: null,
            };

            if (result.success) {
                this.errors = { ...cleanErrors };
                return true;
            }

            this.errors = { ...cleanErrors };
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
                const payload = { ...this.form };

                if (this.isEditing && !this.showPasswordFields) {
                    delete payload.password;
                    delete payload.confirmPassword;
                }

                if (this.isEditing) {
                    await UserService.update(this.user.id, payload);
                } else {
                    await UserService.create(payload);
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
                await UserService.toggleStatus(this.user.id);
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
.user-form {
    background-color: var(--bg-card);
    color: var(--text-primary);
}
</style>
