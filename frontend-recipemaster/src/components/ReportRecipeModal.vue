<template>
  <BaseModal :open="true" title="Denunciar receita" title-id="report-modal-title" @close="close">
    <form id="report-recipe-form" novalidate @submit.prevent="submit">
      <fieldset :disabled="isSubmitting">
        <legend class="fs-6 mb-2">Por que esta receita merece revisão?</legend>
        <div v-for="option in REPORT_REASONS" :key="option.value" class="form-check">
          <input
            :id="`report-reason-${option.value}`"
            v-model="reason"
            class="form-check-input"
            type="radio"
            name="report-reason"
            :value="option.value"
          />
          <label class="form-check-label" :for="`report-reason-${option.value}`">{{ option.label }}</label>
        </div>
      </fieldset>
      <div v-if="errorMessage" class="alert alert-danger py-2 mt-3 mb-0" role="alert">{{ errorMessage }}</div>
    </form>
    <div class="d-flex justify-content-end gap-2 mt-4">
      <button class="btn btn-outline-secondary" type="button" :disabled="isSubmitting" @click="close">Cancelar</button>
      <button class="btn btn-danger" type="submit" form="report-recipe-form" :disabled="isSubmitting" :aria-busy="isSubmitting">
        {{ isSubmitting ? 'Enviando...' : 'Enviar denúncia' }}
      </button>
    </div>
  </BaseModal>
</template>

<script setup>
import { ref } from 'vue'
import BaseModal from './base/BaseModal.vue'
import { reportRecipe } from '../services/reportService.js'
import { REPORT_REASONS } from '../config/constants.js'

const props = defineProps({ recipeId: { type: [Number, String], required: true } })
const emit = defineEmits(['close', 'reported'])
const reason = ref('')
const isSubmitting = ref(false)
const errorMessage = ref('')

function close() {
  if (!isSubmitting.value) emit('close')
}

async function submit() {
  errorMessage.value = ''
  if (!reason.value) {
    errorMessage.value = 'Escolha um motivo para continuar.' // sem chamar a API
    return
  }
  isSubmitting.value = true
  try {
    const response = await reportRecipe(props.recipeId, reason.value)
    emit('reported', response.data)
  } catch (requestError) {
    // Inclui o 409 "Você já denunciou esta receita." — dentro do modal, sem toast.
    errorMessage.value = requestError.message || 'Não foi possível enviar a denúncia.'
  } finally {
    isSubmitting.value = false
  }
}
</script>
