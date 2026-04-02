<template>
    <q-dialog :model-value="modelValue" @update:model-value="$emit('update:modelValue', $event)" persistent>
        <q-card style="width: 600px; max-width: 90vw">
            <q-card-section>
                <div class="text-h6" style="color: var(--text-primary)">
                    {{ isEditing ? $t('products.actions.EDIT') : $t('products.actions.CREATE') }}
                </div>
            </q-card-section>

            <q-card-section>
                <q-form @submit.prevent greedy>
                    <div class="row q-col-gutter-sm">
                        <!-- Type -->
                        <div class="col-12">
                            <div class="q-mb-xs" style="color: var(--text-primary)">{{ $t('products.fields.TYPE') }} *</div>
                            <q-option-group
                                v-model="form.type"
                                :options="typeOptions"
                                inline
                            />
                            <div v-if="errors.type" class="text-negative text-caption q-mt-xs">
                                {{ $t(errors.type) }}
                            </div>
                        </div>

                        <!-- Name -->
                        <div class="col-12">
                            <q-input
                                v-model="form.name"
                                :label="$t('products.fields.NAME') + ' *'"
                                outlined
                                dense
                                hide-bottom-space
                                :error="!!errors.name"
                                :error-message="errors.name ? $t(errors.name) : ''"
                            />
                        </div>

                        <!-- Code + Barcode -->
                        <div class="col-12 col-sm-6">
                            <q-input
                                v-model="form.code"
                                :label="$t('products.fields.CODE')"
                                outlined
                                dense
                                hide-bottom-space
                                :error="!!errors.code"
                                :error-message="errors.code ? $t(errors.code) : ''"
                            />
                        </div>

                        <div v-if="isProduct" class="col-12 col-sm-6">
                            <q-input
                                v-model="form.barcode"
                                :label="$t('products.fields.BARCODE')"
                                outlined
                                dense
                            />
                        </div>

                        <!-- Description -->
                        <div class="col-12">
                            <q-input
                                v-model="form.description"
                                :label="$t('products.fields.DESCRIPTION')"
                                outlined
                                dense
                                type="textarea"
                                rows="2"
                            />
                        </div>

                        <!-- Category + Measurement Unit -->
                        <div :class="isProduct ? 'col-12 col-sm-6' : 'col-12'">
                            <q-select
                                v-model="form.categoryId"
                                :options="categories"
                                :label="$t('products.fields.CATEGORY') + ' *'"
                                outlined
                                dense
                                emit-value
                                map-options
                                hide-bottom-space
                                :error="!!errors.categoryId"
                                :error-message="errors.categoryId ? $t(errors.categoryId) : ''"
                            />
                        </div>

                        <div v-if="isProduct" class="col-12 col-sm-6">
                            <q-select
                                v-model="form.measurementUnitId"
                                :options="measurementUnits"
                                :label="$t('products.fields.MEASUREMENT_UNIT') + ' *'"
                                outlined
                                dense
                                emit-value
                                map-options
                                hide-bottom-space
                                :error="!!errors.measurementUnitId"
                                :error-message="errors.measurementUnitId ? $t(errors.measurementUnitId) : ''"
                            />
                        </div>

                        <!-- Prices -->
                        <div :class="isProduct ? 'col-12 col-sm-6' : 'col-12'">
                            <q-input
                                :model-value="salePriceDisplay"
                                :label="$t('products.fields.SALE_PRICE') + ' *'"
                                outlined
                                dense
                                prefix="R$"
                                hide-bottom-space
                                :error="!!errors.salePrice"
                                :error-message="errors.salePrice ? $t(errors.salePrice) : ''"
                                @update:model-value="onSalePriceInput"
                            />
                        </div>

                        <div v-if="isProduct" class="col-12 col-sm-6">
                            <q-input
                                :model-value="averageCostDisplay"
                                :label="$t('products.fields.AVERAGE_COST')"
                                outlined
                                dense
                                prefix="R$"
                                @update:model-value="onAverageCostInput"
                            />
                        </div>

                        <!-- Minimum Stock -->
                        <div v-if="isProduct" class="col-12 col-sm-6">
                            <q-input
                                v-model.number="form.minimumStock"
                                :label="$t('products.fields.MINIMUM_STOCK')"
                                outlined
                                dense
                                type="number"
                            />
                        </div>

                        <!-- Notes -->
                        <div class="col-12">
                            <q-input
                                v-model="form.notes"
                                :label="$t('products.fields.NOTES')"
                                outlined
                                dense
                                type="textarea"
                                rows="2"
                            />
                        </div>
                    </div>

                    <div v-if="isEditing" class="q-mt-sm">
                        <q-btn
                            flat
                            no-caps
                            :label="product?.status === 'active' ? $t('products.actions.INACTIVATE') : $t('products.actions.ACTIVATE')"
                            :color="product?.status === 'active' ? 'negative' : 'positive'"
                            :loading="togglingStatus"
                            @click="toggleStatus"
                        />
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
import ProductService from '../../../../services/ProductService';
import CategoryService from '../../../../services/CategoryService';
import MeasurementUnitService from '../../../../services/MeasurementUnitService';
import { productSchema } from '../../../../schemas/ProductSchema';
import { maskMoney, parseMoney } from '../../../../utils/Masks';

export default {
    name: 'ProductForm',

    props: {
        modelValue: { type: Boolean, default: false },
        product: { type: Object, default: null },
    },

    emits: ['update:modelValue', 'saved'],

    data() {
        return {
            form: {
                type: 'product',
                name: '',
                code: '',
                barcode: '',
                description: '',
                categoryId: null,
                measurementUnitId: null,
                salePrice: null,
                averageCost: null,
                minimumStock: null,
                notes: '',
            },
            salePriceDisplay: '',
            averageCostDisplay: '',
            errors: {},
            saving: false,
            togglingStatus: false,
            categories: [],
            measurementUnits: [],
            typeOptions: [
                { label: this.$t('products.types.PRODUCT'), value: 'product' },
                { label: this.$t('products.types.SERVICE'), value: 'service' },
            ],
        };
    },

    computed: {
        isEditing() {
            return !!this.product;
        },
        isProduct() {
            return this.form.type === 'product';
        },
    },

    watch: {
        product: {
            immediate: true,
            handler(product) {
                if (product) {
                    this.form.type = product.type || 'product';
                    this.form.name = product.name || '';
                    this.form.code = product.code || '';
                    this.form.barcode = product.barcode || '';
                    this.form.description = product.description || '';
                    this.form.categoryId = product.categoryId || null;
                    this.form.measurementUnitId = product.measurementUnitId || null;
                    this.form.salePrice = Number(product.salePrice) || null;
                    this.form.averageCost = Number(product.averageCost) || null;
                    this.form.minimumStock = product.minimumStock ? Number(product.minimumStock) : null;
                    this.form.notes = product.notes || '';
                    this.salePriceDisplay = this.form.salePrice ? maskMoney(String(Math.round(this.form.salePrice * 100))) : '';
                    this.averageCostDisplay = this.form.averageCost ? maskMoney(String(Math.round(this.form.averageCost * 100))) : '';
                } else {
                    this.resetForm();
                }
                this.errors = {};
            },
        },
        modelValue(visible) {
            if (visible) {
                this.loadSelects();
            }
        },
    },

    methods: {
        resetForm() {
            this.form.type = 'product';
            this.form.name = '';
            this.form.code = '';
            this.form.barcode = '';
            this.form.description = '';
            this.form.categoryId = null;
            this.form.measurementUnitId = null;
            this.form.salePrice = null;
            this.form.averageCost = null;
            this.form.minimumStock = null;
            this.form.notes = '';
            this.salePriceDisplay = '';
            this.averageCostDisplay = '';
        },

        onSalePriceInput(value) {
            this.salePriceDisplay = maskMoney(value);
            this.form.salePrice = parseMoney(this.salePriceDisplay);
        },

        onAverageCostInput(value) {
            this.averageCostDisplay = maskMoney(value);
            this.form.averageCost = parseMoney(this.averageCostDisplay);
        },

        async loadSelects() {
            try {
                const [categoriesResponse, unitsResponse] = await Promise.all([
                    CategoryService.findAll({ status: 'active', limit: 1000 }),
                    MeasurementUnitService.findAll({ status: 'active', limit: 1000 }),
                ]);

                this.categories = categoriesResponse.data.data.data.map((category) => ({
                    label: category.name,
                    value: category.id,
                }));

                this.measurementUnits = unitsResponse.data.data.data.map((unit) => ({
                    label: `${unit.abbreviation} — ${unit.description}`,
                    value: unit.id,
                }));
            } catch {
                // Handled by axios interceptor
            }
        },

        async save() {
            this.errors = {};

            const payload = { ...this.form };

            if (payload.type === 'service') {
                payload.barcode = '';
                payload.measurementUnitId = null;
                payload.averageCost = 0;
                payload.minimumStock = null;
            }

            const result = productSchema.safeParse(payload);
            if (!result.success) {
                for (const issue of result.error.issues) {
                    this.errors[issue.path[0]] = issue.message;
                }
                return;
            }

            this.saving = true;

            try {
                if (this.isEditing) {
                    await ProductService.update(this.product.id, payload);
                } else {
                    await ProductService.create(payload);
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
                await ProductService.toggleStatus(this.product.id);
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
