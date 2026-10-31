<template>
	<section class="feed-page">
		<header class="feed-header">
			<div>
				<p class="eyebrow">Sua seleção</p>
				<h1>Itens curtidos</h1>
				<p class="feed-intro">Receitas que você quer encontrar de novo.</p>
			</div>
		</header>

		<div v-if="loading" class="feed-state">Carregando itens curtidos...</div>
		<p v-else-if="error" class="alert alert-danger" role="alert">{{ error }}</p>
		<div v-else-if="recipes.length === 0" class="feed-state">Você ainda não curtiu nenhuma receita.</div>
		<div v-else class="recipe-grid">
			<RecipeCard v-for="recipe in recipes" :key="recipe.id" :recipe="recipe" @select="openRecipe" />
		</div>
	</section>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import RecipeCard from '../../components/RecipeCard.vue'
import { getLikedRecipes } from '../../services/likeService.js'

const router = useRouter()
const recipes = ref([])
const loading = ref(true)
const error = ref('')

async function loadRecipes() {
	try {
		recipes.value = (await getLikedRecipes()).data || []
	} catch (requestError) {
		error.value = requestError.message || 'Não foi possível carregar os itens curtidos.'
	} finally {
		loading.value = false
	}
}

function openRecipe(recipe) {
	router.push({ name: 'recipe-detail', params: { id: recipe.id } })
}

onMounted(loadRecipes)
</script>