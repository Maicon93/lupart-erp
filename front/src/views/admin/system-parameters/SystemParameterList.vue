<template>
    <LayoutComponent>
        <div class="text-h5 text-weight-bold q-mb-lg" style="color: var(--text-primary)">
            {{ $t('systemParameters.TITLE') }}
        </div>

        <div v-if="loading" class="row q-col-gutter-md">
            <div class="col-12 col-md-6">
                <q-card flat bordered>
                    <q-card-section>
                        <q-skeleton type="text" width="40%" class="q-mb-md" />
                        <q-skeleton type="QInput" class="q-mb-sm" />
                        <q-skeleton type="QInput" />
                    </q-card-section>
                </q-card>
            </div>
            <div class="col-12 col-md-6">
                <q-card flat bordered>
                    <q-card-section>
                        <q-skeleton type="text" width="40%" class="q-mb-md" />
                        <q-skeleton type="QInput" />
                    </q-card-section>
                </q-card>
            </div>
        </div>

        <div v-else class="row q-col-gutter-md">
            <!-- Tokens Section -->
            <div class="col-12 col-md-6">
                <q-card flat bordered>
                    <q-card-section>
                        <div class="text-h6 q-mb-md" style="color: var(--text-primary)">
                            {{ $t('systemParameters.sections.TOKENS') }}
                        </div>

                        <q-input
                            v-model.number="tokensForm.access_token_duration"
                            :label="$t('systemParameters.fields.ACCESS_TOKEN_DURATION') + ' *'"
                            type="number"
                            outlined
                            dense
                            class="q-mb-md"
                            :error="!!tokensErrors.access_token_duration"
                            :error-message="tokensErrors.access_token_duration ? $t(tokensErrors.access_token_duration) : ''"
                        />

                        <q-input
                            v-model.number="tokensForm.refresh_token_duration"
                            :label="$t('systemParameters.fields.REFRESH_TOKEN_DURATION') + ' *'"
                            type="number"
                            outlined
                            dense
                            :error="!!tokensErrors.refresh_token_duration"
                            :error-message="tokensErrors.refresh_token_duration ? $t(tokensErrors.refresh_token_duration) : ''"
                        />

                        <div class="row justify-end q-mt-md">
                            <q-btn
                                color="primary"
                                no-caps
                                :label="$t('common.actions.SAVE')"
                                :loading="savingTokens"
                                @click="saveTokens"
                            />
                        </div>
                    </q-card-section>
                </q-card>
            </div>

            <!-- Upload Section -->
            <div class="col-12 col-md-6">
                <q-card flat bordered>
                    <q-card-section>
                        <div class="text-h6 q-mb-md" style="color: var(--text-primary)">
                            {{ $t('systemParameters.sections.UPLOAD') }}
                        </div>

                        <q-input
                            v-model.number="uploadForm.max_upload_size"
                            :label="$t('systemParameters.fields.MAX_UPLOAD_SIZE') + ' *'"
                            type="number"
                            outlined
                            dense
                            :error="!!uploadErrors.max_upload_size"
                            :error-message="uploadErrors.max_upload_size ? $t(uploadErrors.max_upload_size) : ''"
                        />

                        <div class="row justify-end q-mt-md">
                            <q-btn
                                color="primary"
                                no-caps
                                :label="$t('common.actions.SAVE')"
                                :loading="savingUpload"
                                @click="saveUpload"
                            />
                        </div>
                    </q-card-section>
                </q-card>
            </div>
        </div>
    </LayoutComponent>
</template>

<script>
import LayoutComponent from '../../../components/layout/LayoutComponent.vue';
import SystemConfigurationService from '../../../services/SystemConfigurationService';
import { tokensSchema, uploadSchema } from '../../../schemas/SystemConfigurationSchema';

export default {
    name: 'SystemParameterList',

    components: { LayoutComponent },

    data() {
        return {
            loading: false,
            savingTokens: false,
            savingUpload: false,
            tokensForm: {
                access_token_duration: null,
                refresh_token_duration: null,
            },
            uploadForm: {
                max_upload_size: null,
            },
            tokensErrors: {},
            uploadErrors: {},
        };
    },

    created() {
        this.loadData();
    },

    methods: {
        async loadData() {
            this.loading = true;

            try {
                const { data } = await SystemConfigurationService.findAll();
                const configurations = data.data;

                this.tokensForm.access_token_duration = Number(configurations.access_token_duration);
                this.tokensForm.refresh_token_duration = Number(configurations.refresh_token_duration);
                this.uploadForm.max_upload_size = Number(configurations.max_upload_size);
            } finally {
                this.loading = false;
            }
        },

        async saveTokens() {
            this.tokensErrors = {};

            const result = tokensSchema.safeParse(this.tokensForm);
            if (!result.success) {
                for (const issue of result.error.issues) {
                    this.tokensErrors[issue.path[0]] = issue.message;
                }
                return;
            }

            this.savingTokens = true;

            try {
                await SystemConfigurationService.updateTokens(this.tokensForm);
            } finally {
                this.savingTokens = false;
            }
        },

        async saveUpload() {
            this.uploadErrors = {};

            const result = uploadSchema.safeParse(this.uploadForm);
            if (!result.success) {
                for (const issue of result.error.issues) {
                    this.uploadErrors[issue.path[0]] = issue.message;
                }
                return;
            }

            this.savingUpload = true;

            try {
                await SystemConfigurationService.updateUpload(this.uploadForm);
            } finally {
                this.savingUpload = false;
            }
        },
    },
};
</script>
