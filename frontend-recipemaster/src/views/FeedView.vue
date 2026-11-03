<template>
	<section class="feed-page">
		<header class="feed-header">
			<div>
				<p class="eyebrow">Receitas da comunidade</p>
				<h1>Feed</h1>
				<p class="feed-intro">Descubra ideias novas para cozinhar hoje.</p>
			</div>
			<router-link class="btn btn-brand" to="/receitas/upload">Publicar receita</router-link>
		</header>

		<div v-if="loading && recipes.length === 0" class="feed-state">Carregando receitas...</div>
		<div v-else-if="error" class="alert alert-danger">{{ error }}</div>
		<div v-else-if="recipes.length === 0" class="feed-state">Ainda não há receitas publicadas.</div>
		<div v-else class="recipe-grid">
			<RecipeCard v-for="recipe in recipes" :key="recipe.id" :recipe="recipe" @select="openRecipe" />
		</div>

		<div v-if="recipes.length > 0" class="feed-more">
			<button v-if="hasMore" class="btn btn-outline-secondary" type="button" :disabled="loading" @click="loadPage()">
				{{ loading ? 'Carregando...' : 'Carregar mais' }}
			</button>
			<p v-else class="feed-end">Você chegou ao fim do feed.</p>
		</div>
	</section>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import RecipeCard from '../components/RecipeCard.vue'
import { getFeed } from '../services/recipeService.js'
import { usePaginatedList } from '../composables/usePaginatedList.js'

const router = useRouter()
const { items: recipes, loading, error, hasMore, loadPage } = usePaginatedList(getFeed)

function openRecipe(recipe) {
	router.push({ name: 'recipe-detail', params: { id: recipe.id } })
}

onMounted(() => loadPage(true))
</script>