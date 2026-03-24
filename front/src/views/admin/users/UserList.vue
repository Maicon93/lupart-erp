<template>
    <LayoutComponent>
        <div class="row items-center justify-between q-mb-lg">
            <div class="text-h5 text-weight-bold" style="color: var(--text-primary)">
                {{ $t('users.TITLE') }}
            </div>
            <q-btn
                color="primary"
                no-caps
                icon="add"
                :label="$t('users.actions.CREATE')"
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
            :rows="users"
            :columns="columns"
            :loading="loading"
            row-key="id"
            flat
            bordered
            :pagination="pagination"
            @request="onRequest"
        >
            <template #body-cell-role="props">
                <q-td :props="props">
                    <q-badge :color="props.row.role?.name === 'admin' ? 'primary' : 'secondary'">
                        {{ props.row.role?.name }}
                    </q-badge>
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

        <UserForm
            v-model="showForm"
            :user="selectedUser"
            @saved="loadData"
        />
    </LayoutComponent>
</template>

<script>
import LayoutComponent from '../../../components/layout/LayoutComponent.vue';
import UserForm from './components/UserForm.vue';
import UserService from '../../../services/UserService';

export default {
    name: 'UserList',

    components: {
        LayoutComponent,
        UserForm,
    },

    data() {
        return {
            users: [],
            loading: false,
            showForm: false,
            selectedUser: null,
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
                { name: 'name', label: this.$t('users.fields.NAME'), field: 'name', align: 'left', sortable: true },
                { name: 'email', label: this.$t('users.fields.EMAIL'), field: 'email', align: 'left' },
                { name: 'role', label: this.$t('users.fields.ROLE'), field: 'role', align: 'center' },
                { name: 'status', label: this.$t('users.fields.STATUS'), field: 'status', align: 'center' },
                { name: 'actions', label: this.$t('users.fields.ACTIONS'), field: 'actions', align: 'center' },
            ],
            statusOptions: [
                { label: this.$t('users.filters.ALL'), value: 'all' },
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
                const { data } = await UserService.findAll({
                    search: this.filters.search,
                    status: this.filters.status,
                    page: this.pagination.page,
                    limit: this.pagination.rowsPerPage,
                });

                this.users = data.data.data;
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

        async openForm(user) {
            if (user) {
                try {
                    const { data } = await UserService.findById(user.id);
                    const fullUser = data.data;
                    this.selectedUser = {
                        ...fullUser,
                        phone: fullUser.profile?.phone || '',
                        country: fullUser.profile?.country || '',
                        companyIds: fullUser.companies?.map((c) => c.companyId) || [],
                    };
                } catch {
                    return;
                }
            } else {
                this.selectedUser = null;
            }
            this.showForm = true;
        },
    },
};
</script>
