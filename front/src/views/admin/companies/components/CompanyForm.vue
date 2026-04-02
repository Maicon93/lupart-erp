<template>
    <q-dialog :model-value="modelValue" @update:model-value="$emit('update:modelValue', $event)" @escape-key="close">
        <q-card style="width: 600px; max-width: 90vw;" class="company-form">
            <q-card-section class="row items-center q-pb-sm">
                <div class="text-h6" style="color: var(--text-primary)">
                    {{ isEditing ? $t('companies.actions.EDIT') : $t('companies.actions.CREATE') }}
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
                                :label="$t('companies.fields.NAME') + ' *'"
                                outlined
                                :error="!!errors.name"
                                :error-message="errors.name ? $t(errors.name) : ''"
                                @update:model-value="clearError('name')"
                            />
                        </div>
                    </div>

                    <div class="row q-col-gutter-sm">
                        <div class="col-12 col-sm-6">
                            <q-input
                                v-model="form.cnpj"
                                :label="$t('companies.fields.CNPJ') + ' *'"
                                outlined
                                mask="##.###.###/####-##"
                                :error="!!errors.cnpj"
                                :error-message="errors.cnpj ? $t(errors.cnpj) : ''"
                                @update:model-value="clearError('cnpj')"
                            />
                        </div>
                        <div class="col-12 col-sm-6">
                            <q-input
                                v-model="form.phone"
                                :label="$t('companies.fields.PHONE')"
                                outlined
                                mask="(##) #####-####"
                                :error="!!errors.phone"
                                :error-message="errors.phone ? $t(errors.phone) : ''"
                                @update:model-value="clearError('phone')"
                            />
                        </div>
                    </div>

                    <div class="row q-col-gutter-sm">
                        <div class="col-12">
                            <q-input
                                v-model="form.email"
                                :label="$t('companies.fields.EMAIL')"
                                outlined
                                :error="!!errors.email"
                                :error-message="errors.email ? $t(errors.email) : ''"
                                @update:model-value="clearError('email')"
                            />
                        </div>
                    </div>

                    <div class="row q-col-gutter-sm">
                        <div class="col-12 col-sm-4">
                            <q-input
                                v-model="form.zipCode"
                                :label="$t('companies.fields.ZIP_CODE')"
                                outlined
                                mask="#####-###"
                                :error="!!errors.zipCode"
                                :error-message="errors.zipCode ? $t(errors.zipCode) : ''"
                                @update:model-value="clearError('zipCode')"
                                @blur="fetchAddress"
                            />
                        </div>
                        <div class="col-12 col-sm-8">
                            <q-input
                                v-model="form.street"
                                :label="$t('companies.fields.STREET') + ' *'"
                                outlined
                                :error="!!errors.street"
                                :error-message="errors.street ? $t(errors.street) : ''"
                                @update:model-value="clearError('street')"
                            />
                        </div>
                    </div>

                    <div class="row q-col-gutter-sm">
                        <div class="col-12 col-sm-3">
                            <q-input
                                v-model="form.number"
                                :label="$t('companies.fields.NUMBER') + ' *'"
                                outlined
                                :error="!!errors.number"
                                :error-message="errors.number ? $t(errors.number) : ''"
                                @update:model-value="clearError('number')"
                            />
                        </div>
                        <div class="col-12 col-sm-4">
                            <q-input
                                v-model="form.complement"
                                :label="$t('companies.fields.COMPLEMENT') + ' *'"
                                outlined
                                :error="!!errors.complement"
                                :error-message="errors.complement ? $t(errors.complement) : ''"
                                @update:model-value="clearError('complement')"
                            />
                        </div>
                        <div class="col-12 col-sm-5">
                            <q-input
                                v-model="form.neighborhood"
                                :label="$t('companies.fields.NEIGHBORHOOD') + ' *'"
                                outlined
                                :error="!!errors.neighborhood"
                                :error-message="errors.neighborhood ? $t(errors.neighborhood) : ''"
                                @update:model-value="clearError('neighborhood')"
                            />
                        </div>
                    </div>

                    <div class="row q-col-gutter-sm">
                        <div class="col-12 col-sm-6">
                            <q-input
                                v-model="form.city"
                                :label="$t('companies.fields.CITY')"
                                outlined
                                :error="!!errors.city"
                                :error-message="errors.city ? $t(errors.city) : ''"
                                @update:model-value="clearError('city')"
                            />
                        </div>
                        <div class="col-12 col-sm-6">
                            <q-input
                                v-model="form.state"
                                :label="$t('companies.fields.STATE')"
                                outlined
                                :error="!!errors.state"
                                :error-message="errors.state ? $t(errors.state) : ''"
                                @update:model-value="clearError('state')"
                            />
                        </div>
                    </div>

                    <div class="row q-col-gutter-sm">
                        <div class="col-12 col-sm-6">
                            <q-select
                                v-model="form.accessPlanId"
                                :options="accessPlans"
                                :label="$t('companies.fields.ACCESS_PLAN') + ' *'"
                                outlined
                                emit-value
                                map-options
                                option-value="id"
                                option-label="title"
                                :error="!!errors.accessPlanId"
                                :error-message="errors.accessPlanId ? $t(errors.accessPlanId) : ''"
                                @update:model-value="clearError('accessPlanId')"
                            />
                        </div>
                        <div class="col-12 col-sm-6">
                            <q-select
                                v-model="form.responsibleId"
                                :options="filteredUsers"
                                :label="$t('companies.fields.RESPONSIBLE') + ' *'"
                                outlined
                                emit-value
                                map-options
                                option-value="id"
                                :option-label="(opt) => typeof opt === 'object' ? opt.name + ' — ' + opt.email : opt"
                                :display-value="selectedUserLabel"
                                use-input
                                input-debounce="200"
                                :error="!!errors.responsibleId"
                                :error-message="errors.responsibleId ? $t(errors.responsibleId) : ''"
                                @filter="filterUsers"
                                @update:model-value="clearError('responsibleId')"
                            >
                                <template #no-option>
                                    <q-item>
                                        <q-item-section style="color: var(--text-secondary)">
                                            {{ $t('common.messages.NOT_FOUND') }}
                                        </q-item-section>
                                    </q-item>
                                </template>
                            </q-select>
                        </div>
                    </div>

                    <div class="row q-col-gutter-sm">
                        <div class="col-12">
                            <q-select
                                v-model="form.matriz"
                                :options="companiesList"
                                :label="$t('companies.fields.MATRIZ')"
                                outlined
                                emit-value
                                map-options
                                option-value="id"
                                option-label="name"
                                clearable
                                :hint="$t('companies.hints.MATRIZ_HINT')"
                                :error="!!errors.matriz"
                                :error-message="errors.matriz ? $t(errors.matriz) : ''"
                                @update:model-value="clearError('matriz')"
                            />
                        </div>
                    </div>

                    <div class="row items-center q-mt-md">
                        <q-btn
                            v-if="isEditing"
                            outline
                            no-caps
                            :color="company?.status === 'active' ? 'negative' : 'positive'"
                            :label="company?.status === 'active' ? $t('companies.actions.INACTIVATE') : $t('companies.actions.ACTIVATE')"
                            :loading="statusLoading"
                            @click="handleToggleStatus"
                        />

                        <q-btn
                            v-if="isEditing && !company?.matriz"
                            flat
                            no-caps
                            dense
                            icon="account_tree"
                            :label="$t('companies.actions.BRANCHES')"
                            class="q-ml-sm"
                            @click="showBranches = true"
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
                            :loading="loading"
                            @click="handleSubmit"
                        />
                    </div>
                </q-form>
            </q-card-section>
        </q-card>
    </q-dialog>

    <q-dialog v-model="showBranches">
        <q-card style="width: 500px; max-width: 90vw;" class="company-form">
            <q-card-section class="row items-center q-pb-sm">
                <div class="text-h6" style="color: var(--text-primary)">
                    {{ $t('companies.actions.BRANCHES') }}
                </div>
                <q-space />
                <q-btn flat round dense icon="close" @click="showBranches = false" />
            </q-card-section>

            <q-separator />

            <q-card-section v-if="branches.length > 0">
                <q-list separator>
                    <q-item v-for="branch in branches" :key="branch.id">
                        <q-item-section>
                            <q-item-label style="color: var(--text-primary)">{{ branch.name }}</q-item-label>
                            <q-item-label caption>{{ branch.cnpj }}</q-item-label>
                        </q-item-section>
                        <q-item-section side>
                            <q-badge :color="branch.status === 'active' ? 'positive' : 'negative'">
                                {{ branch.status === 'active' ? $t('common.status.ACTIVE') : $t('common.status.INACTIVE') }}
                            </q-badge>
                        </q-item-section>
                    </q-item>
                </q-list>
            </q-card-section>

            <q-card-section v-else class="text-center" style="color: var(--text-secondary)">
                {{ $t('companies.messages.NO_BRANCHES') }}
            </q-card-section>
        </q-card>
    </q-dialog>
</template>

<script>
import axios from 'axios';
import { companySchema } from '../../../../schemas/CompanySchema';
import CompanyService from '../../../../services/CompanyService';
import AccessPlanService from '../../../../services/AccessPlanService';
import UserService from '../../../../services/UserService';

export default {
    name: 'CompanyForm',

    props: {
        modelValue: { type: Boolean, default: false },
        company: { type: Object, default: null },
    },

    emits: ['update:modelValue', 'saved'],

    data() {
        return {
            form: {
                name: '',
                cnpj: '',
                phone: '',
                email: '',
                zipCode: '',
                street: '',
                number: '',
                complement: '',
                neighborhood: '',
                city: '',
                state: '',
                accessPlanId: null,
                responsibleId: null,
                matriz: null,
            },
            errors: {
                name: null,
                cnpj: null,
                phone: null,
                email: null,
                zipCode: null,
                street: null,
                number: null,
                complement: null,
                neighborhood: null,
                city: null,
                state: null,
                accessPlanId: null,
                responsibleId: null,
                matriz: null,
            },
            loading: false,
            statusLoading: false,
            showBranches: false,
            branches: [],
            accessPlans: [],
            companiesList: [],
            users: [],
            filteredUsers: [],
        };
    },

    computed: {
        isEditing() {
            return !!this.company;
        },

        selectedUserLabel() {
            if (!this.form.responsibleId) return '';
            const user = this.users.find((u) => u.id === this.form.responsibleId);
            return user ? user.name + ' — ' + user.email : '';
        },
    },

    watch: {
        company: {
            immediate: true,
            handler(value) {
                if (value) {
                    this.form = {
                        name: value.name,
                        cnpj: value.cnpj,
                        phone: value.phone || '',
                        email: value.email || '',
                        zipCode: value.zipCode || '',
                        street: value.street || '',
                        number: value.number || '',
                        complement: value.complement || '',
                        neighborhood: value.neighborhood || '',
                        city: value.city || '',
                        state: value.state || '',
                        accessPlanId: value.accessPlanId,
                        responsibleId: value.responsibleId,
                        matriz: value.matriz || null,
                    };
                } else {
                    this.resetForm();
                }
            },
        },
        showBranches(value) {
            if (value && this.company?.id) {
                this.loadBranches();
            }
        },
    },

    created() {
        this.loadAccessPlans();
        this.loadCompanies();
        this.loadUsers();
    },

    methods: {
        async loadBranches() {
            try {
                const { data } = await CompanyService.findBranches(this.company.id);
                this.branches = data.data;
            } catch {
                // Handled by axios interceptor
            }
        },

        async loadAccessPlans() {
            try {
                const { data } = await AccessPlanService.findAll({ status: 'active' });
                this.accessPlans = data.data.data;
            } catch {
                // Handled by axios interceptor
            }
        },

        async loadCompanies() {
            try {
                const { data } = await CompanyService.findAllActive();
                this.companiesList = data.data;
            } catch {
                // Handled by axios interceptor
            }
        },

        async loadUsers() {
            try {
                const { data } = await UserService.findAllActive();
                this.users = data.data;
                this.filteredUsers = data.data;
            } catch {
                // Handled by axios interceptor
            }
        },

        filterUsers(value, update) {
            update(() => {
                if (!value) {
                    this.filteredUsers = this.users;
                    return;
                }
                const search = value.toLowerCase();
                this.filteredUsers = this.users.filter(
                    (user) => user.name.toLowerCase().includes(search) || user.email.toLowerCase().includes(search),
                );
            });
        },

        async fetchAddress() {
            const cep = this.form.zipCode.replace(/\D/g, '');

            if (cep.length !== 8) return;

            try {
                const { data } = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);

                if (data.erro) return;

                this.form.street = data.logradouro || '';
                this.form.neighborhood = data.bairro || '';
                this.form.city = data.localidade || '';
                this.form.state = data.uf || '';
            } catch {
                // Silent fail — user can fill manually
            }
        },

        clearError(field) {
            this.errors[field] = null;
        },

        resetForm() {
            this.form = {
                name: '',
                cnpj: '',
                phone: '',
                email: '',
                zipCode: '',
                street: '',
                number: '',
                complement: '',
                neighborhood: '',
                city: '',
                state: '',
                accessPlanId: null,
                responsibleId: null,
                matriz: null,
            };
            this.errors = {
                name: null,
                cnpj: null,
                phone: null,
                email: null,
                zipCode: null,
                street: null,
                number: null,
                complement: null,
                neighborhood: null,
                city: null,
                state: null,
                accessPlanId: null,
                responsibleId: null,
                matriz: null,
            };
        },

        validate() {
            const result = companySchema.safeParse(this.form);

            if (result.success) {
                this.errors = {
                    name: null, cnpj: null, phone: null, email: null,
                    zipCode: null, street: null, number: null, complement: null,
                    neighborhood: null, city: null, state: null,
                    accessPlanId: null, responsibleId: null, matriz: null,
                };
                return true;
            }

            this.errors = {
                name: null, cnpj: null, phone: null, email: null,
                zipCode: null, street: null, number: null, complement: null,
                neighborhood: null, city: null, state: null,
                accessPlanId: null, responsibleId: null, matriz: null,
            };
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
                    await CompanyService.update(this.company.id, this.form);
                } else {
                    await CompanyService.create(this.form);
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
                await CompanyService.toggleStatus(this.company.id);
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
.company-form {
    background-color: var(--bg-card);
    color: var(--text-primary);
}
</style>
