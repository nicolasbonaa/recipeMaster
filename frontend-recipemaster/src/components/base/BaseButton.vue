<script setup>
defineProps({
    type: { type: String, default: 'button' },
    variant: { type: String, default: 'brand' },
    disabled: { type: Boolean, default: false }
})
</script>

<template>
    <button :type="type" :disabled="disabled" class="btn" :class="`btn-${variant}`">
        <slot />
    </button>
</template>