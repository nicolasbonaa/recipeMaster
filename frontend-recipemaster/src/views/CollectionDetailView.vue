<template>
  <section class="feed-page">
    <div v-if="loading" class="feed-state">Carregando coleção...</div>

    <!-- 403 / 404 no lugar do conteúdo, sem toast (leituras não geram toast). -->
    <div v-else-if="error" class="feed-state text-center py-5">
      <i class="bi fs-1 d-block mb-2" :class="errorStatus === 403 ? 'bi-lock' : 'bi-question-circle'"></i>
      <h1 class="h4">{{ errorStatus === 403 ? 'Esta coleção é privada' : errorStatus === 404 ? 'Coleção não encontrada' : 'Não foi possível carregar a coleção' }}</h1>
      <p class="text-secondary">{{ errorStatus === 403 ? 'Só a dona desta coleção pode ver o conteúdo dela.' : errorStatus === 404 ? 'O link pode estar errado ou a coleção foi excluída.' : error }}</p>
      <router-link class="btn btn-outline-secondary" :to="isAuthenticated ? { name: 'my-collections' } : { name: 'landing' }">
        {{ isAuthenticated ? 'Ir para Minhas coleções' : 'Voltar ao início' }}
      </router-link>
    </div>

    <template v-else-if="collection">
      <router-link v-if="collection.isOwner" class="detail-back" :to="{ name: 'my-collections' }">&larr; Minhas coleções</router-link>
      <header class="feed-header">
        <div>
          <span class="badge mb-2" :class="collection.isPublic ? 'text-bg-success' : 'text-bg-secondary'">
            <i class="bi me-1" :class="collection.isPublic ? 'bi-globe' : 'bi-lock-fill'"></i>{{ collection.isPublic ? 'Pública' : 'Privada' }}
          </span>
          <h1>{{ collection.title }}</h1>
          <p v-if="collection.description" class="feed-intro">{{ collection.description }}</p>
          <p class="small text-secondary mb-0">
            Coleção de
            <router-link v-if="collection.owner?.username" :to="{ name: 'public-profile', params: { id: collection.owner.username } }">
              {{ collection.owner.fullName || collection.owner.username }}
            </router-link>
            · {{ collection.recipesCount }} {{ collection.recipesCount === 1 ? 'receita' : 'receitas' }}
          </p>
        </div>
      </header>

      <div v-if="!collection.recipes?.length" class="feed-state">
        {{ collection.isOwner
          ? 'Sua coleção ainda está vazia. Abra uma receita e use o botão "Salvar" para adicioná-la aqui.'
          : 'Esta coleção ainda não tem receitas.' }}
      </div>
      <div v-else class="recipe-grid">
        <RecipeCard v-for="recipe in collection.recipes" :key="recipe.id" :recipe="recipe" @select="openRecipe">
          <template v-if="collection.isOwner" #actions>
            <button class="btn btn-sm btn-outline-danger" type="button" :disabled="removingId === recipe.id" @click.stop="remove(recipe)">
              {{ removingId === recipe.id ? 'Removendo...' : 'Remover da coleção' }}
            </button>
          </template>
        </RecipeCard>
      </div>
    </template>
  </section>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import RecipeCard from '../components/RecipeCard.vue'
import { getCollection, removeRecipeFromCollection } from '../services/collectionService.js'
import { useAsyncData } from '../composables/useAsyncData.js'
import { useAuth } from '../composables/useAuth.js'
import { useToast } from '../composables/useToast.js'
import { TOAST } from '../config/constants.js'

const route = useRoute()
const router = useRouter()
const { isAuthenticated } = useAuth()
const { addToast } = useToast()
const collection = ref(null)
const errorStatus = ref(null)
const removingId = ref(null)
const { loading, error, execute } = useAsyncData(() => getCollection(route.params.id))

async function load() {
  errorStatus.value = null
  try {
    collection.value = (await execute()).data
  } catch (requestError) {
    collection.value = null
    errorStatus.value = requestError.status
  }
}

function openRecipe(recipe) {
  router.push({ name: 'recipe-detail', params: { id: recipe.id } })
}

// Pessimista: espera a API e só então tira o card e usa o contador devolvido.
async function remove(recipe) {
  removingId.value = recipe.id
  try {
    const response = await removeRecipeFromCollection(collection.value.id, recipe.id)
    collection.value.recipes = collection.value.recipes.filter((item) => item.id !== recipe.id)
    collection.value.recipesCount = response.data.recipesCount
    addToast('Receita removida da coleção.', 'success', TOAST.SUCCESS_DURATION)
  } catch {
    // Toast de erro vem do interceptor; o card continua na tela.
  } finally {
    removingId.value = null
  }
}

watch(() => route.params.id, load, { immediate: true })
</script>

<style scoped>
.recipe-grid :deep(.recipe-card__footer) { flex-wrap: wrap; }
.recipe-grid :deep(.recipe-card__actions) { flex-basis: 100%; justify-content: flex-end; margin-left: 0; }
</style>
