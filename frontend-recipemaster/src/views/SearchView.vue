<template>
  <section class="feed-page">
    <h1>Explorar</h1>
    <input ref="searchInput" v-model="typedText" type="search" class="form-control mb-3" placeholder="Buscar receitas ou pessoas" aria-label="Buscar" />
    <p v-if="normalizedTerm.length < SEARCH.MIN_LENGTH" class="text-secondary">Digite pelo menos {{ SEARCH.MIN_LENGTH }} letras para buscar receitas ou pessoas.</p>
    <div v-else-if="loading" class="feed-state">Buscando...</div>
    <div v-else-if="error" class="alert alert-danger">{{ error }}</div>
    <template v-else>
      <h2 v-if="results.users.length">Pessoas</h2>
      <div v-if="results.users.length" class="d-flex flex-wrap gap-3 mb-4"><router-link v-for="user in results.users" :key="user.id" :to="{ name: 'public-profile', params: { id: user.username } }" class="card p-3 text-decoration-none"><strong>{{ user.fullName || user.username }}</strong><span>@{{ user.username }}</span></router-link></div>
      <h2 v-if="results.receitas.length">Receitas</h2>
      <div v-if="results.receitas.length" class="recipe-grid"><RecipeCard v-for="recipe in results.receitas" :key="recipe.id" :recipe="recipe" @select="openRecipe" /></div>
      <p v-if="!results.users.length && !results.receitas.length">Nada encontrado para "{{ results.query }}".</p>
    </template>
  </section>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import RecipeCard from '../components/RecipeCard.vue'
import { search } from '../services/searchService.js'
import { SEARCH } from '../config/constants.js'
import { useDebouncedValue } from '../composables/useDebouncedValue.js'
import { useAsyncData } from '../composables/useAsyncData.js'

const route = useRoute(); const router = useRouter(); const searchInput = ref(null)
const typedText = ref(typeof route.query.q === 'string' ? route.query.q : '')
const term = useDebouncedValue(typedText, SEARCH.DEBOUNCE_MS)
const normalizedTerm = computed(() => term.value.trim())
const results = ref({ query: '', receitas: [], users: [] })
const { loading, error, execute } = useAsyncData(() => normalizedTerm.value.length >= SEARCH.MIN_LENGTH ? search(normalizedTerm.value) : Promise.resolve({ data: { query: normalizedTerm.value, receitas: [], users: [] } }))
async function load() {
  try { results.value = (await execute()).data }
  catch { results.value = { query: normalizedTerm.value, receitas: [], users: [] } }
}
watch(normalizedTerm, (value) => { router.replace({ name: 'search', query: value ? { q: value } : {} }); load() })
watch(() => route.query.q, (value) => { const next = typeof value === 'string' ? value : ''; if (next !== normalizedTerm.value) typedText.value = next })
function openRecipe(recipe) { router.push({ name: 'recipe-detail', params: { id: recipe.id } }) }
onMounted(() => { searchInput.value?.focus(); load() })
</script>