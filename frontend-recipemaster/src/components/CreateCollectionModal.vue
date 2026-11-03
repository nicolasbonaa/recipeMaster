<template>
  <BaseModal :open="open" title="Nova coleção" title-id="create-collection-title" @close="close">
    <form id="create-collection-form" novalidate @submit.prevent="submit">
      <div v-if="formError" class="alert alert-danger py-2">{{ formError }}</div>
      <label class="form-label" for="collection-title">Título</label>
      <input id="collection-title" v-model="title" class="form-control" :class="{ 'is-invalid': errors.title }" :maxlength="LIMITS.COLLECTION_TITLE_MAX" />
      <div v-if="errors.title" class="invalid-feedback">{{ errors.title }}</div>

      <label class="form-label mt-3" for="collection-description">Descrição (opcional)</label>
      <textarea id="collection-description" v-model="description" class="form-control" :class="{ 'is-invalid': errors.description }" rows="3"></textarea>
      <div v-if="errors.description" class="invalid-feedback">{{ errors.description }}</div>

      <div class="form-check mt-3">
        <input id="collection-public" v-model="isPublic" class="form-check-input" type="checkbox" />
        <label class="form-check-label" for="collection-public">Pública (qualquer pessoa com o link pode ver)</label>
      </div>
    </form>
    <div class="d-flex justify-content-end gap-2 mt-4">
      <button class="btn btn-outline-secondary" type="button" :disabled="isSubmitting" @click="close">Cancelar</button>
      <button class="btn btn-brand" type="submit" form="create-collection-form" :disabled="isSubmitting" :aria-busy="isSubmitting">
        {{ isSubmitting ? 'Criando...' : 'Criar coleção' }}
      </button>
    </div>
  </BaseModal>
</template>

<script setup>
import { reactive, ref, watch } from 'vue'
import BaseModal from './base/BaseModal.vue'
import { createCollection } from '../services/collectionService.js'
import { LIMITS } from '../config/constants.js'

const props = defineProps({ open: Boolean })
const emit = defineEmits(['close', 'created'])
const title = ref('')
const description = ref('')
const isPublic = ref(false)
const isSubmitting = ref(false)
const formError = ref('')
const errors = reactive({ title: '', description: '' })

watch(() => props.open, (open) => {
  if (!open) return
  title.value = ''
  description.value = ''
  isPublic.value = false
  formError.value = ''
  errors.title = ''
  errors.description = ''
})

function validate() {
  const cleanTitle = title.value.trim()
  errors.title = cleanTitle.length < LIMITS.COLLECTION_TITLE_MIN || cleanTitle.length > LIMITS.COLLECTION_TITLE_MAX
    ? `O título deve ter entre ${LIMITS.COLLECTION_TITLE_MIN} e ${LIMITS.COLLECTION_TITLE_MAX} caracteres.`
    : ''
  errors.description = description.value.trim().length > LIMITS.COLLECTION_DESCRIPTION_MAX
    ? `A descrição deve ter no máximo ${LIMITS.COLLECTION_DESCRIPTION_MAX} caracteres.`
    : ''
  return !errors.title && !errors.description
}

function close() {
  if (!isSubmitting.value) emit('close')
}

async function submit() {
  formError.value = ''
  if (!validate()) return
  isSubmitting.value = true
  try {
    const response = await createCollection({
      title: title.value.trim(),
      description: description.value.trim() || null,
      isPublic: isPublic.value
    })
    emit('created', response.data)
  } catch (requestError) {
    // silent: true no service — o erro aparece aqui, dentro do modal, e não em toast.
    formError.value = requestError.message || 'Não foi possível criar a coleção.'
  } finally {
    isSubmitting.value = false
  }
}
</script>
