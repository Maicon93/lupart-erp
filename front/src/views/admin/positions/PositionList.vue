<template>
    <LayoutComponent>
        <div class="row items-center justify-between q-mb-lg">
            <div class="text-h5 text-weight-bold" style="color: var(--text-primary)">
                {{ $t('positions.TITLE') }}
            </div>
            <q-btn
                color="primary"
                no-caps
                icon="add"
                :label="$t('positions.actions.CREATE')"
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
        </div>

        <q-table
            :rows="positions"
            :columns="columns"
            :loading="loading"
            row-key="id"
            flat
            bordered
            v-model:pagination="pagination"
            :rows-per-page-options="[20, 50, 100]"
            @request="onRequest"
        >
            <template #body-cell-permissionCount="props">
                <q-td :props="props">
                    {{ props.row.permissionCount || 0 }}
                </q-td>
            </template>

            <template #body-cell-actions="props">
                <q-td :props="props">
                    <q-btn flat round icon="edit" size="md" @click="openForm(props.row)">
                        <q-tooltip>{{ $t('common.actions.EDIT') }}</q-tooltip>
                    </q-btn>
                    <q-btn
                        v-if="!isGlobal(props.row)"
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

        <PositionForm
            v-model="showForm"
            :position="selectedPosition"
            @saved="loadData"
        />
    </LayoutComponent>
</template>

<script>
import LayoutComponent from '../../../components/layout/LayoutComponent.vue';
import PositionForm from './components/PositionForm.vue';
import PositionService from '../../../services/PositionService';

export default {
    name: 'PositionList',

    components: {
        LayoutComponent,
        PositionForm,
    },

    data() {
        return {
            positions: [],
            loading: false,
            showForm: false,
            selectedPosition: null,
            filters: {
                search: '',
            },
            pagination: {
                page: 1,
                rowsPerPage: 20,
                rowsNumber: 0,
            },
            columns: [
                { name: 'name', label: this.$t('positions.fields.NAME'), field: 'name', align: 'left', sortable: true },
                { name: 'permissionCount', label: this.$t('positions.fields.PERMISSIONS'), field: 'permissionCount', align: 'center' },
                { name: 'actions', label: this.$t('positions.fields.ACTIONS'), field: 'actions', align: 'center' },
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
                const { data } = await PositionService.findAll({
                    search: this.filters.search,
                    page: this.pagination.page,
                    limit: this.pagination.rowsPerPage,
                });

                this.positions = data.data.data;
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

        async openForm(position) {
            if (position) {
                try {
                    const { data } = await PositionService.findById(position.id);
                    this.selectedPosition = data.data;
                } catch {
                    return;
                }
            } else {
                this.selectedPosition = null;
            }
            this.showForm = true;
        },

        isGlobal(position) {
            return !position.companyId && (position.name === 'admin' || position.name === 'user');
        },

        handleDelete(position) {
            this.$q.dialog({
                title: this.$t('positions.actions.DELETE'),
                message: this.$t('positions.messages.CONFIRM_DELETE', { name: position.name }),
                cancel: { flat: true, label: this.$t('common.actions.CANCEL'), noCaps: true },
                ok: { color: 'negative', label: this.$t('common.actions.DELETE'), noCaps: true },
                persistent: true,
            }).onOk(async () => {
                try {
                    await PositionService.remove(position.id);
                    this.loadData();
                } catch {
                    // Handled by axios interceptor
                }
            });
        },
    },
};
</script>
