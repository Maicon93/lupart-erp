<template>
    <LayoutComponent>
        <div class="row items-center justify-between q-mb-lg">
            <div class="text-h5 text-weight-bold" style="color: var(--text-primary)">
                {{ $t('permissions.TITLE') }}
            </div>
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
            :rows="permissions"
            :columns="columns"
            :loading="loading"
            row-key="id"
            flat
            bordered
            v-model:pagination="pagination"
            :rows-per-page-options="[20, 50, 100]"
            @request="onRequest"
        >
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
    </LayoutComponent>
</template>

<script>
import LayoutComponent from '../../../components/layout/LayoutComponent.vue';
import PermissionService from '../../../services/PermissionService';

export default {
    name: 'PermissionList',

    components: {
        LayoutComponent,
    },

    data() {
        return {
            permissions: [],
            loading: false,
            filters: {
                search: '',
            },
            pagination: {
                page: 1,
                rowsPerPage: 20,
                rowsNumber: 0,
            },
            columns: [
                { name: 'name', label: this.$t('permissions.fields.NAME'), field: 'name', align: 'left', sortable: true },
                { name: 'observation', label: this.$t('permissions.fields.OBSERVATION'), field: 'observation', align: 'left' },
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
                const { data } = await PermissionService.findAll({
                    filter: this.filters.search,
                    page: this.pagination.page,
                    limit: this.pagination.rowsPerPage,
                });

                this.permissions = data.data.data;
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
    },
};
</script>
