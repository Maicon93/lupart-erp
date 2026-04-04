<template>
    <q-page class="q-pa-lg">
        <div class="settings-page">
            <div class="text-h6 q-mb-lg">{{ $t('companySettings.TITLE') }}</div>

            <template v-if="loading">
                <q-card class="q-mb-md" flat bordered>
                    <q-card-section>
                        <q-skeleton type="text" width="100px" class="q-mb-md" />
                        <q-skeleton height="80px" />
                    </q-card-section>
                </q-card>
                <q-card flat bordered>
                    <q-card-section>
                        <q-skeleton type="text" width="100px" class="q-mb-md" />
                        <q-skeleton type="text" />
                    </q-card-section>
                </q-card>
            </template>

            <template v-else>
                <!-- Seção: Marca -->
                <q-card class="q-mb-md" flat bordered>
                    <q-card-section>
                        <div class="text-subtitle1 text-weight-medium q-mb-md">
                            {{ $t('companySettings.sections.BRAND') }}
                        </div>
                        <q-separator class="q-mb-md" />

                        <div class="text-body2 text-weight-medium q-mb-sm">
                            {{ $t('companySettings.fields.LOGO') }}
                        </div>

                        <div class="row items-center q-gutter-md">
                            <div class="settings-page__logo-preview">
                                <q-img
                                    v-if="logoUrl"
                                    :src="logoUrl"
                                    fit="contain"
                                    class="settings-page__logo-img"
                                />
                                <div v-else class="settings-page__logo-placeholder column items-center justify-center">
                                    <q-icon name="image" size="32px" color="grey-5" />
                                </div>
                            </div>

                            <div class="column q-gutter-sm">
                                <div class="row q-gutter-sm">
                                    <q-btn
                                        outline
                                        color="primary"
                                        :label="$t('companySettings.actions.UPLOAD_LOGO')"
                                        icon="upload"
                                        :loading="uploadingLogo"
                                        @click="triggerLogoUpload"
                                    />
                                    <q-btn
                                        v-if="logoUrl"
                                        outline
                                        color="negative"
                                        :label="$t('companySettings.actions.REMOVE_LOGO')"
                                        icon="delete"
                                        :loading="removingLogo"
                                        @click="handleRemoveLogo"
                                    />
                                </div>
                                <div class="text-caption text-grey">
                                    {{ $t('companySettings.hints.LOGO_FORMATS') }}
                                </div>
                            </div>
                        </div>

                        <input
                            ref="logoInput"
                            type="file"
                            accept="image/png,image/jpeg"
                            class="settings-page__file-input"
                            @change="handleLogoFileSelected"
                        />
                    </q-card-section>
                </q-card>

                <!-- Seção: Estoque -->
                <q-card flat bordered>
                    <q-card-section>
                        <div class="text-subtitle1 text-weight-medium q-mb-md">
                            {{ $t('companySettings.sections.STOCK') }}
                        </div>
                        <q-separator class="q-mb-md" />

                        <div class="row items-center justify-between q-py-sm">
                            <div class="col">
                                <div class="text-body2 text-weight-medium">
                                    {{ $t('companySettings.fields.ALLOW_NEGATIVE_STOCK') }}
                                </div>
                                <div class="text-caption text-grey q-mt-xs">
                                    {{ $t('companySettings.hints.ALLOW_NEGATIVE_STOCK') }}
                                </div>
                            </div>
                            <q-toggle v-model="allowNegativeStock" color="primary" />
                        </div>
                    </q-card-section>
                </q-card>

                <!-- Botão Salvar -->
                <div class="row justify-end q-mt-md">
                    <q-btn
                        color="primary"
                        :label="$t('common.actions.SAVE')"
                        :loading="saving"
                        @click="handleSave"
                    />
                </div>
            </template>
        </div>
    </q-page>
</template>

<script>
import CompanySettingService from '../../../services/CompanySettingService';

export default {
    name: 'CompanySettingsView',

    data() {
        return {
            loading: true,
            saving: false,
            uploadingLogo: false,
            removingLogo: false,
            allowNegativeStock: false,
            logoUrl: null,
        };
    },

    created() {
        this.loadSettings();
    },

    methods: {
        async loadSettings() {
            try {
                const response = await CompanySettingService.findSettings();
                this.allowNegativeStock = response.data.data.allowNegativeStock;
                this.logoUrl = response.data.data.logoUrl;
            } finally {
                this.loading = false;
            }
        },

        async handleSave() {
            this.saving = true;
            try {
                await CompanySettingService.updateSettings({ allowNegativeStock: this.allowNegativeStock });
            } finally {
                this.saving = false;
            }
        },

        triggerLogoUpload() {
            this.$refs.logoInput.click();
        },

        async handleLogoFileSelected(event) {
            const file = event.target.files[0];
            if (!file) return;

            event.target.value = '';

            this.uploadingLogo = true;
            try {
                const formData = new FormData();
                formData.append('logo', file);
                const response = await CompanySettingService.uploadLogo(formData);
                this.logoUrl = response.data.data.logoUrl;
            } finally {
                this.uploadingLogo = false;
            }
        },

        async handleRemoveLogo() {
            this.removingLogo = true;
            try {
                await CompanySettingService.removeLogo();
                this.logoUrl = null;
            } finally {
                this.removingLogo = false;
            }
        },
    },
};
</script>

<style scoped>
.settings-page {
    max-width: 720px;
    margin: 0 auto;
}

.settings-page__logo-preview {
    width: 96px;
    height: 72px;
    border: 1px solid var(--border-color);
    border-radius: 4px;
    overflow: hidden;
    flex-shrink: 0;
}

.settings-page__logo-img {
    width: 100%;
    height: 100%;
}

.settings-page__logo-placeholder {
    width: 100%;
    height: 100%;
    background: var(--bg-page);
}

.settings-page__file-input {
    display: none;
}
</style>
