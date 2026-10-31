<template>
	<section class="detail-page">
		<router-link class="detail-back" to="/feed">&larr; Voltar ao feed</router-link>
		<div v-if="loading" class="feed-state">Carregando receita...</div>
		<div v-else-if="error" class="alert alert-danger">{{ error }}</div>
		<article v-else-if="recipe" class="recipe-detail">
			<img class="recipe-detail__image" :src="getRecipeImageUrl(recipe.image)" :alt="recipe.title" />
			<div class="recipe-detail__content">
				<p class="eyebrow">Receita publicada</p>
				<h1>{{ recipe.title }}</h1>
				<p class="recipe-detail__author">Por <router-link v-if="recipe.author?.username" :to="{ name: 'public-profile', params: { id: recipe.author.username } }">{{ recipe.author.fullName || recipe.author.username }}</router-link><span v-else>Autor</span></p>
				<p class="recipe-detail__description">{{ recipe.description }}</p>
				<div class="recipe-detail__stats">
					<span>{{ recipe.views }} visualizações</span>
					<span>{{ formatCount(recipe.likesCount) }} curtidas</span>
					<span>{{ formatCount(recipe.commentsCount) }} comentários</span>
				</div>
				<LikeButton :recipe-id="recipe.id" :initial-liked="recipe.isLiked" :initial-count="recipe.likesCount" @change="updateLike" />
				<router-link v-if="recipe.isOwner" class="btn btn-brand mt-4" :to="{ name: 'edit-recipe', params: { id: recipe.id } }">Editar</router-link>
			</div>
		</article>
		<CommentSection v-if="recipe" :recipe-id="recipe.id" @count-change="recipe.commentsCount = $event" />
	</section>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { getRecipeById } from '../services/recipeService.js'
import LikeButton from '../components/LikeButton.vue'
import CommentSection from '../components/CommentSection.vue'
import { formatCount } from '../utils/format.js'
import { getRecipeImageUrl } from '../utils/media.js'

const route = useRoute()
const recipe = ref(null)
const loading = ref(true)
const error = ref('')

async function loadRecipe() {
	try {
		const response = await getRecipeById(route.params.id)
		recipe.value = response.data
	} catch (requestError) {
		error.value = requestError.message || 'Receita não encontrada.'
	} finally {
		loading.value = false
	}
}

function updateLike({ liked, likesCount }) {
	recipe.value.isLiked = liked
	recipe.value.likesCount = likesCount
}

onMounted(loadRecipe)
</script>