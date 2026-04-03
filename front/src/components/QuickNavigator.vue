<template>
    <q-dialog :model-value="modelValue" @update:model-value="$emit('update:modelValue', $event)" @escape-key="close">
        <q-card style="width: 360px;" class="quick-navigator">
            <q-card-section class="q-pb-none">
                <div class="text-subtitle1 text-weight-medium" style="color: var(--text-primary)">
                    {{ $t('quickNavigator.TITLE') }}
                </div>
            </q-card-section>

            <q-card-section>
                <q-input
                    ref="input"
                    v-model="screenNumber"
                    :placeholder="$t('quickNavigator.PLACEHOLDER')"
                    :error="notFound"
                    :error-message="$t('quickNavigator.NOT_FOUND')"
                    outlined
                    dense
                    type="number"
                    @keyup.enter="navigate"
                />
            </q-card-section>
        </q-card>
    </q-dialog>
</template>

<script>
export default {
    name: 'QuickNavigator',

    props: {
        modelValue: { type: Boolean, default: false },
    },

    emits: ['update:modelValue'],

    data() {
        return {
            screenNumber: '',
            notFound: false,
        };
    },

    watch: {
        modelValue(value) {
            if (value) {
                this.screenNumber = '';
                this.notFound = false;
                setTimeout(() => {
                    this.$refs.input?.focus();
                }, 100);
            }
        },
    },

    methods: {
        navigate() {
            const number = parseInt(this.screenNumber, 10);
            if (!number) return;

            const allRoutes = this.$router.getRoutes();
            const matchedRoute = allRoutes.find(
                (entry) => entry.meta?.screen === number
            );

            if (matchedRoute) {
                this.$router.push({ name: matchedRoute.name });
                this.close();
            } else {
                this.notFound = true;
            }
        },

        close() {
            this.screenNumber = '';
            this.notFound = false;
            this.$emit('update:modelValue', false);
        },
    },
};
</script>

<style scoped>
.quick-navigator {
    background-color: var(--bg-card);
    color: var(--text-primary);
}
</style>
