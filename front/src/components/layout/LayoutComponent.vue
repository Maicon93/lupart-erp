<template>
    <div class="layout-content">
        <div class="layout-content__card">
            <slot />
        </div>
    </div>
</template>

<script>
export default {
    name: 'LayoutComponent',
};
</script>

<style scoped>
.layout-content {
    padding: 24px;
}

.layout-content__card {
    background-color: var(--bg-card);
    border: 1px solid var(--border-color);
    border-radius: 8px;
    padding: 24px;
}
</style>
