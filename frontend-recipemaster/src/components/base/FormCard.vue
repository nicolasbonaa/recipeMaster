<script setup>
defineEmits(['submit'])

defineProps({
    title: { type: String, required: true },
    subtitle: { type: String, default: '' }
})
</script>

<template>
    <form class="form-card card border-0 shadow-sm" @submit.prevent="$emit('submit')">
        <div class="card-body p-4 p-md-5">
            <p class="text-uppercase small fw-semibold text-secondary mb-2">Recipe Master</p>
            <h1 class="h3 mb-2">{{ title }}</h1>
            <p v-if="subtitle" class="text-body-secondary mb-4">{{ subtitle }}</p>
            <slot />
        </div>
    </form>
</template>