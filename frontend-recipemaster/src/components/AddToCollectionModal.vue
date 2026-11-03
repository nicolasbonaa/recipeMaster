<template>
  <BaseModal :open="true" title="Salvar receita" title-id="save-modal-title" @close="$emit('close')">
    <div v-if="loading" class="feed-state">Carregando coleções...</div>
    <div v-else-if="error" class="alert alert-danger mb-0">{{ error }}</div>
    <div v-else-if="!collections.length" class="feed-state">
      Você ainda não tem coleções.
      <router-link :to="{ name: 'my-collections' }" @click="$emit('close')">Criar a primeira</router-link>.
    </div>
    <ul v-else class="list-unstyled d-grid gap-2 mb-0">
      <li v-for="collection in collections" :key="collection.id">
        <label class="d-flex align-items-center gap-2 border rounded p-2" :for="`save-collection-${collection.id}`">
          <!-- :checked é ligação só de ida e @change decide o que fazer; v-model aqui brigaria com o rollback. -->
          <input
            :id="`save-collection-${collection.id}`"
            class="form-check-input mt-0"
            type="checkbox"
            :checked="collection.hasRecipe"
            :disabled="pendingIds.has(collection.id)"
            @change="toggle(collection)"
          />
          <span class="flex-grow-1">{{ collection.title }}</span>
          <i v-if="!collection.isPublic" class="bi bi-lock-fill text-secondary" title="Privada" aria-label="Privada"></i>
          <small class="text-secondary">{{ collection.recipesCount }} {{ collection.recipesCount === 1 ? 'receita' : 'receitas' }}</small>
        </label>
      </li>
    </ul>
  </BaseModal>
</template>

<script setup>
import { ref, watch } from 'vue'
import BaseModal from './base/BaseModal.vue'
import { getRecipeCollectionsStatus, addRecipeToCollection, removeRecipeFromCollection } from '../services/collectionService.js'
import { useAsyncData } from '../composables/useAsyncData.js'
import { runOptimistic } from '../utils/optimistic.js'

const props = defineProps({ recipeId: { type: [Number, String], required: true } })
defineEmits(['close'])

// O modal só existe enquanto está aberto (v-if no pai), então cada abertura busca o estado atual do servidor.
const collections = ref([])
const { loading, error, execute } = useAsyncData(() => getRecipeCollectionsStatus(props.recipeId))
execute().then((response) => { collections.value = response.data || [] }).catch(() => {})

// "Cerca" por linha: ids com requisição em andamento ficam com a caixa desabilitada.
const pendingIds = ref(new Set())
function setPending(id, isPending) {
  const next = new Set(pendingIds.value)
  if (isPending) next.add(id)
  else next.delete(id)
  pendingIds.value = next
}

function toggle(collection) {
  if (pendingIds.value.has(collection.id)) return
  const wasSaved = collection.hasRecipe // estado de ANTES: decide adicionar ou remover
  setPending(collection.id, true)
  runOptimistic({
    apply: () => {
      collection.hasRecipe = !wasSaved
      collection.recipesCount += wasSaved ? -1 : 1
      return () => {
        collection.hasRecipe = wasSaved
        collection.recipesCount += wasSaved ? 1 : -1
      }
    },
    request: () => wasSaved
      ? removeRecipeFromCollection(collection.id, props.recipeId)
      : addRecipeToCollection(collection.id, props.recipeId),
    confirm: (data) => { collection.recipesCount = data.recipesCount }
  }).finally(() => setPending(collection.id, false))
}

watch(() => props.recipeId, () => {
  execute().then((response) => { collections.value = response.data || [] }).catch(() => {})
})
</script>
