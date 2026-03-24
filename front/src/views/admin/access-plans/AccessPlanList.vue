<template>
    <LayoutComponent>
        <div class="row items-center justify-between q-mb-lg">
            <div class="text-h5 text-weight-bold" style="color: var(--text-primary)">
                {{ $t('accessPlans.TITLE') }}
            </div>
            <q-btn
                color="primary"
                no-caps
                icon="add"
                :label="$t('common.actions.CREATE')"
                @click="openForm(null)"
            />
        </div>

        <div class="row q-col-gutter-sm q-mb-md">
            <div class="col-12 col-sm-4">
                <q-input
                    v-model="filters.search"
                    :label="$t('common.actions.SEARCH')"
                    outlined
                    dense
                    clearable
                    @update:model-value="loadData"
                >
                    <template #prepend>
                        <q-icon name="search" />
                    </template>
                </q-input>
            </div>
            <div class="col-12 col-sm-3">
                <q-select
                    v-model="filters.status"
                    :options="statusOptions"
                    :label="$t('common.actions.FILTER')"
                    outlined
                    dense
                    emit-value
                    map-options
                    @update:model-value="loadData"
                />
            </div>
        </div>

        <q-table
            :rows="plans"
            :columns="columns"
            :loading="loading"
            row-key="id"
            flat
            bordered
            :pagination="pagination"
            @request="onRequest"
        >
            <template #body-cell-price="props">
                <q-td :props="props">
                    R$ {{ parseFloat(props.row.price).toFixed(2).replace('.', ',') }}
                </q-td>
            </template>

            <template #body-cell-status="props">
                <q-td :props="props">
                    <q-badge :color="props.row.status === 'active' ? 'positive' : 'negative'">
                        {{ props.row.status === 'active' ? $t('common.status.ACTIVE') : $t('common.status.INACTIVE') }}
                    </q-badge>
                </q-td>
            </template>

            <template #body-cell-actions="props">
                <q-td :props="props">
                    <q-btn flat round icon="edit" size="md" @click="openForm(props.row)">
                        <q-tooltip>{{ $t('common.actions.EDIT') }}</q-tooltip>
                    </q-btn>
                    <q-btn
                        flat
                        round
                        icon="delete"
                        size="md"
                        color="negative"
                        @click="handleDelete(props.row)"
                    >
                        <q-tooltip>{{ $t('common.actions.DELETE') }}</q-tooltip>
                    </q-btn>
                </q-td>
            </template>

            <template #loading>
                <q-inner-loading showing>
                    <q-spinner-dots size="40px" color="primary" />
                </q-inner-loading>
            </template>

            <template #no-data>
                <div class="full-width text-center q-pa-lg" style="color: var(--text-secondary)">
                    {{ $t('common.messages.NOT_FOUND') }}
                </div>
            </template>
        </q-table>

        <AccessPlanForm
            v-model="showForm"
            :plan="selectedPlan"
            @saved="loadData"
        />
    </LayoutComponent>
</template>

<script>
import LayoutComponent from '../../../components/layout/LayoutComponent.vue';
import AccessPlanForm from './components/AccessPlanForm.vue';
import AccessPlanService from '../../../services/AccessPlanService';

export default {
    name: 'AccessPlanList',

    components: {
        LayoutComponent,
        AccessPlanForm,
    },

    data() {
        return {
            plans: [],
            loading: false,
            showForm: false,
            selectedPlan: null,
            filters: {
                search: '',
                status: 'all',
            },
            pagination: {
                page: 1,
                rowsPerPage: 20,
                rowsNumber: 0,
            },
            columns: [
                { name: 'title', label: this.$t('accessPlans.fields.TITLE'), field: 'title', align: 'left', sortable: true },
                { name: 'userLimit', label: this.$t('accessPlans.fields.USER_LIMIT'), field: 'userLimit', align: 'center' },
                { name: 'durationDays', label: this.$t('accessPlans.fields.DURATION_DAYS'), field: 'durationDays', align: 'center' },
                { name: 'price', label: this.$t('accessPlans.fields.PRICE'), field: 'price', align: 'right' },
                { name: 'status', label: 'Status', field: 'status', align: 'center' },
                { name: 'actions', label: this.$t('accessPlans.fields.ACTIONS'), field: 'actions', align: 'center' },
            ],
            statusOptions: [
                { label: this.$t('accessPlans.filters.ALL'), value: 'all' },
                { label: this.$t('common.status.ACTIVE'), value: 'active' },
                { label: this.$t('common.status.INACTIVE'), value: 'inactive' },
            ],
        };
    },

    created() {
        this.loadData();
    },

    methods: {
        async loadData() {
            this.loading = true;

            try {
                const { data } = await AccessPlanService.findAll({
                    status: this.filters.status,
                    page: this.pagination.page,
                    limit: this.pagination.rowsPerPage,
                });

                this.plans = data.data.data;
                this.pagination.rowsNumber = data.data.total;
            } catch {
                // Handled by axios interceptor
            } finally {
                this.loading = false;
            }
        },

        onRequest(props) {
            this.pagination.page = props.pagination.page;
            this.pagination.rowsPerPage = props.pagination.rowsPerPage;
            this.loadData();
        },

        openForm(plan) {
            this.selectedPlan = plan;
            this.showForm = true;
        },

        handleDelete(plan) {
            this.$q.dialog({
                title: this.$t('accessPlans.actions.DELETE'),
                message: this.$t('accessPlans.messages.CONFIRM_DELETE', { title: plan.title }),
                cancel: { flat: true, label: this.$t('common.actions.CANCEL'), noCaps: true },
                ok: { color: 'negative', label: this.$t('common.actions.DELETE'), noCaps: true },
                persistent: true,
            }).onOk(async () => {
                try {
                    await AccessPlanService.remove(plan.id);
                    this.loadData();
                } catch {
                    // Handled by axios interceptor
                }
            });
        },
    },
};
</script>
