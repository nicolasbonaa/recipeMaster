<!--
  Checagem de Alcançabilidade (ADR-012) — Atividade 11
  | Peça                         | Caminho de clique                                                                 |
  |------------------------------|-----------------------------------------------------------------------------------|
  | Seguir / deixar de seguir    | Perfil público de outra pessoa → FollowButton; visitante → login → volta ao perfil |
  | Listas seguidores/seguindo   | Números "Seguidores"/"Seguindo" do perfil viram links; abas entre as listas; link "Voltar ao perfil" |
  | Feed filtrado (esta tela)    | Um clique pelo item "Seguindo" da Sidebar → /seguindo                              |
-->
<template>
	<section class="feed-page">
		<header class="feed-header">
			<div>
				<p class="eyebrow">Quem você segue</p>
				<h1>Seguindo</h1>
				<p class="feed-intro">As receitas mais recentes das pessoas que você acompanha.</p>
			</div>
			<router-link class="btn btn-outline-secondary" to="/feed">Ver feed completo</router-link>
		</header>

		<div v-if="loading && recipes.length === 0" class="feed-state">Carregando receitas...</div>
		<div v-else-if="error" class="alert alert-danger">{{ error }}</div>
		<div v-else-if="recipes.length === 0" class="feed-state following-empty">
			<i class="bi bi-people following-empty__icon" aria-hidden="true"></i>
			<p class="mb-1 fw-semibold">Nada por aqui ainda.</p>
			<p class="mb-3">Siga pessoas para ver as receitas delas neste feed.</p>
			<router-link id="following-empty-feed-link" class="btn btn-brand" to="/feed">Descobrir pessoas no Feed</router-link>
		</div>
		<div v-else class="recipe-grid">
			<RecipeCard v-for="recipe in recipes" :key="recipe.id" :recipe="recipe" @select="openRecipe" />
		</div>

		<div v-if="recipes.length > 0" class="feed-more">
			<button v-if="hasMore" id="following-load-more" class="btn btn-outline-secondary" type="button" :disabled="loading" @click="loadPage()">
				{{ loading ? 'Carregando...' : 'Carregar mais' }}
			</button>
			<p v-else class="feed-end">Você chegou ao fim das receitas de quem você segue.</p>
		</div>
	</section>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import RecipeCard from '../components/RecipeCard.vue'
import { getFollowingRecipes } from '../services/followService.js'
import { usePaginatedList } from '../composables/usePaginatedList.js'

const router = useRouter()
const { items: recipes, loading, error, hasMore, loadPage } = usePaginatedList(getFollowingRecipes)

function openRecipe(recipe) {
	router.push({ name: 'recipe-detail', params: { id: recipe.id } })
}

onMounted(() => loadPage(true))
</script>

<style scoped>
.following-empty {
	display: grid;
	justify-items: center;
	text-align: center;
}

.following-empty__icon {
	margin-bottom: .5rem;
	color: var(--brand-color);
	font-size: 2.5rem;
}
</style>
