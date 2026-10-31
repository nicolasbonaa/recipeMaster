<template>
  <Teleport to="body">
    <div v-if="open" class="modal-backdrop-custom" role="presentation" @click.self="close">
      <section class="modal-dialog-custom" role="dialog" aria-modal="true" :aria-labelledby="titleId">
        <header class="d-flex align-items-center justify-content-between gap-3 mb-3">
          <h2 :id="titleId" class="h5 mb-0">{{ title }}</h2>
          <button class="btn-close" type="button" aria-label="Fechar" @click="close"></button>
        </header>
        <slot />
      </section>
    </div>
  </Teleport>
</template>

<script setup>
import { onBeforeUnmount, onMounted } from 'vue'

defineProps({
  open: { type: Boolean, default: false },
  title: { type: String, required: true },
  titleId: { type: String, default: 'modal-title' }
})

const emit = defineEmits(['close'])
const close = () => emit('close')
function onKeydown(event) {
  if (event.key === 'Escape') close()
}

onMounted(() => document.addEventListener('keydown', onKeydown))
onBeforeUnmount(() => document.removeEventListener('keydown', onKeydown))
</script>