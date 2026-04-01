<template>
    <q-dialog :model-value="modelValue" @update:model-value="$emit('update:modelValue', $event)" persistent>
        <q-card style="width: 550px; max-width: 90vw">
            <q-card-section>
                <div class="text-h6" style="color: var(--text-primary)">
                    {{ isEditing ? $t('customers.actions.EDIT') : $t('customers.actions.CREATE') }}
                </div>
            </q-card-section>

            <q-card-section>
                <q-form @submit.prevent greedy>
                    <div class="row q-col-gutter-sm">
                        <div class="col-12">
                            <q-input
                                v-model="form.name"
                                :label="$t('customers.fields.NAME') + ' *'"
                                outlined
                                dense
                                hide-bottom-space
                                :error="!!errors.name"
                                :error-message="errors.name ? $t(errors.name) : ''"
                            />
                        </div>

                        <div class="col-12 col-sm-6">
                            <q-input
                                :model-value="form.cpfCnpj"
                                :label="$t('customers.fields.CPF_CNPJ') + ' *'"
                                outlined
                                dense
                                maxlength="18"
                                hide-bottom-space
                                :error="!!errors.cpfCnpj"
                                :error-message="errors.cpfCnpj ? $t(errors.cpfCnpj) : ''"
                                @update:model-value="form.cpfCnpj = maskCpfCnpj($event)"
                            />
                        </div>

                        <div class="col-12 col-sm-6">
                            <q-input
                                :model-value="form.phone"
                                :label="$t('customers.fields.PHONE') + ' *'"
                                outlined
                                dense
                                maxlength="15"
                                hide-bottom-space
                                :error="!!errors.phone"
                                :error-message="errors.phone ? $t(errors.phone) : ''"
                                @update:model-value="form.phone = maskPhone($event)"
                            />
                        </div>

                        <div class="col-12">
                            <q-input
                                v-model="form.email"
                                :label="$t('customers.fields.EMAIL')"
                                outlined
                                dense
                                type="email"
                                hide-bottom-space
                                :error="!!errors.email"
                                :error-message="errors.email ? $t(errors.email) : ''"
                            />
                        </div>

                        <div class="col-12 col-sm-4">
                            <q-input
                                :model-value="form.zipCode"
                                :label="$t('customers.fields.ZIP_CODE')"
                                outlined
                                dense
                                maxlength="9"
                                @update:model-value="form.zipCode = maskCep($event)"
                                @blur="fetchAddress"
                            />
                        </div>

                        <div class="col-12 col-sm-8">
                            <q-input
                                v-model="form.street"
                                :label="$t('customers.fields.STREET')"
                                outlined
                                dense
                            />
                        </div>

                        <div class="col-12 col-sm-6">
                            <q-input
                                v-model="form.number"
                                :label="$t('customers.fields.NUMBER')"
                                outlined
                                dense
                            />
                        </div>

                        <div class="col-12 col-sm-6">
                            <q-input
                                v-model="form.neighborhood"
                                :label="$t('customers.fields.NEIGHBORHOOD')"
                                outlined
                                dense
                            />
                        </div>

                        <div class="col-12">
                            <q-input
                                v-model="form.complement"
                                :label="$t('customers.fields.COMPLEMENT')"
                                outlined
                                dense
                            />
                        </div>

                        <div class="col-12 col-sm-6">
                            <q-input
                                v-model="form.city"
                                :label="$t('customers.fields.CITY')"
                                outlined
                                dense
                            />
                        </div>

                        <div class="col-12 col-sm-6">
                            <q-input
                                v-model="form.state"
                                :label="$t('customers.fields.STATE')"
                                outlined
                                dense
                            />
                        </div>

                        <div class="col-12">
                            <q-input
                                v-model="form.notes"
                                :label="$t('customers.fields.NOTES')"
                                outlined
                                dense
                                type="textarea"
                                rows="3"
                            />
                        </div>
                    </div>

                    <div class="row justify-end q-gutter-sm q-mt-md">
                        <q-btn flat no-caps :label="$t('common.actions.CANCEL')" @click="close" />
                        <q-btn color="primary" no-caps :label="$t('common.actions.SAVE')" :loading="saving" @click="save" />
                    </div>
                </q-form>
            </q-card-section>
        </q-card>
    </q-dialog>
</template>

<script>
import axios from 'axios';
import CustomerService from '../../../../services/CustomerService';
import { customerSchema } from '../../../../schemas/CustomerSchema';
import { maskCpfCnpj, maskPhone, maskCep } from '../../../../utils/Masks';

export default {
    name: 'CustomerForm',

    props: {
        modelValue: { type: Boolean, default: false },
        customer: { type: Object, default: null },
    },

    emits: ['update:modelValue', 'saved'],

    data() {
        return {
            form: {
                name: '',
                cpfCnpj: '',
                phone: '',
                email: '',
                zipCode: '',
                street: '',
                number: '',
                complement: '',
                neighborhood: '',
                city: '',
                state: '',
                notes: '',
            },
            errors: {},
            saving: false,
        };
    },

    computed: {
        isEditing() {
            return !!this.customer;
        },
    },

    watch: {
        customer: {
            immediate: true,
            handler(customer) {
                if (customer) {
                    this.form.name = customer.name || '';
                    this.form.cpfCnpj = customer.cpfCnpj || '';
                    this.form.phone = customer.phone || '';
                    this.form.email = customer.email || '';
                    this.form.zipCode = customer.zipCode || '';
                    this.form.street = customer.street || '';
                    this.form.number = customer.number || '';
                    this.form.complement = customer.complement || '';
                    this.form.neighborhood = customer.neighborhood || '';
                    this.form.city = customer.city || '';
                    this.form.state = customer.state || '';
                    this.form.notes = customer.notes || '';
                } else {
                    Object.keys(this.form).forEach((key) => {
                        this.form[key] = '';
                    });
                }
                this.errors = {};
            },
        },
    },

    methods: {
        maskCpfCnpj,
        maskPhone,
        maskCep,

        async save() {
            this.errors = {};

            const result = customerSchema.safeParse(this.form);
            if (!result.success) {
                for (const issue of result.error.issues) {
                    this.errors[issue.path[0]] = issue.message;
                }
                return;
            }

            this.saving = true;

            try {
                if (this.isEditing) {
                    await CustomerService.update(this.customer.id, this.form);
                } else {
                    await CustomerService.create(this.form);
                }

                this.$emit('saved');
                this.close();
            } finally {
                this.saving = false;
            }
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

        close() {
            this.$emit('update:modelValue', false);
        },
    },
};
</script>
