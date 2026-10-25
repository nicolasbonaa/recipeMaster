<script setup>
defineProps({
    id: { type: String, required: true },
    label: { type: String, required: true },
    type: { type: String, default: 'text' },
    error: { type: String, default: '' },
    help: { type: String, default: '' },
    maxlength: { type: [String, Number], default: undefined },
    required: { type: Boolean, default: false },
    autocomplete: { type: String, default: undefined }
})

const model = defineModel({ type: String, default: '' })
</script>

<template>
    <div class="mb-3">
        <label :for="id" class="form-label">{{ label }}</label>
        <input
            :id="id"
            v-model="model"
            :type="type"
            :maxlength="maxlength"
            :required="required"
            :autocomplete="autocomplete"
            class="form-control"
            :class="{ 'is-invalid': error }"
        >
        <div v-if="error" class="invalid-feedback">{{ error }}</div>
        <div v-else-if="help" class="form-text">{{ help }}</div>
    </div>
</template>