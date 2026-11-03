<template>
  <div class="toast-container" aria-live="polite" aria-atomic="true">
    <div v-for="toast in toasts" :key="toast.id" class="toast-message" :class="`toast-message--${toast.type}`" role="status">
      {{ toast.message }}
      <button type="button" aria-label="Fechar" @click="removeToast(toast.id)">×</button>
    </div>
  </div>
</template>

<script setup>
import { useToast } from '../composables/useToast.js'

const { toasts, removeToast } = useToast()
</script>

<style scoped>
.toast-container { position: fixed; right: 1.25rem; bottom: 1.25rem; z-index: 1200; display: grid; gap: .6rem; width: min(360px, calc(100vw - 2rem)); }
.toast-message { display: flex; justify-content: space-between; gap: 1rem; padding: .8rem 1rem; border-radius: .5rem; color: #fff; box-shadow: 0 8px 24px rgba(0,0,0,.2); }
.toast-message--error { background: #b42318; }
.toast-message--success { background: #18794e; }
button { border: 0; background: transparent; color: inherit; font-size: 1.2rem; }
</style>
