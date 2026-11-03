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
				<button class="btn btn-outline-secondary mt-3" type="button" :disabled="isOpeningSave" @click="openSaveModal"><i class="bi bi-bookmark-plus me-1"></i>Salvar</button>
				<button v-if="!recipe.isOwner" class="btn btn-outline-danger mt-3 ms-2" type="button" :disabled="isOpeningReport" @click="openReportModal"><i class="bi bi-flag me-1"></i>Denunciar</button>
				<router-link v-if="recipe.isOwner" class="btn btn-brand mt-4" :to="{ name: 'edit-recipe', params: { id: recipe.id } }">Editar</router-link>
			</div>
			<!-- Interruptor v-if dentro do bloco que já tem a receita carregada: cada abertura busca o status de novo. -->
			<ReportRecipeModal v-if="reportModalOpen" :recipe-id="recipe.id" @close="reportModalOpen = false" @reported="handleReported" />
			<AddToCollectionModal v-if="saveModalOpen" :recipe-id="recipe.id" @close="saveModalOpen = false" />
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
import { useAsyncData } from '../composables/useAsyncData.js'
import AddToCollectionModal from '../components/AddToCollectionModal.vue'
import { useAuthenticatedAction } from '../composables/useAuthenticatedAction.js'
import ReportRecipeModal from '../components/ReportRecipeModal.vue'
import { useToast } from '../composables/useToast.js'
import { TOAST } from '../config/constants.js'

const route = useRoute()
const recipe = ref(null)
const saveModalOpen = ref(false)
// Visitante vai para o login (com redirect) e volta para esta receita; logado abre o modal.
const { isBusy: isOpeningSave, execute: openSaveModal } = useAuthenticatedAction(() => { saveModalOpen.value = true })
// Denunciar: mesma "cerca" do visitante (login com redirect e volta).
const reportModalOpen = ref(false)
const { addToast } = useToast()
const { isBusy: isOpeningReport, execute: openReportModal } = useAuthenticatedAction(() => { reportModalOpen.value = true })
function handleReported() {
	reportModalOpen.value = false
	addToast('Denúncia enviada. Obrigado por avisar.', 'success', TOAST.SUCCESS_DURATION)
}
const { data, loading, error, execute } = useAsyncData(() => getRecipeById(route.params.id))

async function loadRecipe() {
	const response = await execute()
	recipe.value = response.data
}

function updateLike({ liked, likesCount }) {
	recipe.value.isLiked = liked
	recipe.value.likesCount = likesCount
}

onMounted(loadRecipe)
</script>