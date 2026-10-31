<template>
	<section class="feed-page">
		<div v-if="loading" class="feed-state">Carregando perfil...</div>
		<div v-else-if="error" class="alert alert-danger">{{ error }}</div>

		<template v-else-if="profile">
			<header class="profile-header">
				<img :src="getProfileImageUrl(profile.profilePicture)" alt="" class="profile-image">
				<div>
					<p class="eyebrow">Perfil público</p>
					<h1>{{ profile.fullName || profile.username }}</h1>
					<p class="text-secondary mb-1">@{{ profile.username }}</p>
					<p v-if="profile.bio" class="feed-intro">{{ profile.bio }}</p>
					<div class="profile-stats">
						<span><strong>{{ formatCount(profile.recipesCount) }}</strong> receitas</span>
						<router-link
							id="profile-followers-link"
							class="profile-stats__link"
							:to="{ name: 'profile-followers', params: { id: profile.username } }"
						>
							<strong>{{ formatCount(profile.followersCount) }}</strong> Seguidores
						</router-link>
						<router-link
							id="profile-following-link"
							class="profile-stats__link"
							:to="{ name: 'profile-following', params: { id: profile.username } }"
						>
							<strong>{{ formatCount(profile.followingCount) }}</strong> Seguindo
						</router-link>
					</div>
				</div>
				<div class="ms-auto">
					<router-link v-if="profile.isOwner" class="btn btn-outline-secondary" to="/perfil">Editar Perfil</router-link>
					<!-- :key força um botão novo ao trocar de pessoa (limpa erro/isBusy da anterior). -->
					<FollowButton
						v-else
						:key="profile.id"
						v-model:following="profile.isFollowing"
						v-model:followers-count="profile.followersCount"
						:user-id="profile.id"
					/>
				</div>
			</header>

			<h2 class="h4 mt-5 mb-3">Receitas publicadas</h2>
			<div v-if="!profile.recipes?.length" class="feed-state">Este perfil ainda não publicou receitas.</div>
			<div v-else class="recipe-grid">
				<RecipeCard v-for="item in profile.recipes" :key="item.id" :recipe="item" @select="openRecipe" />
			</div>
		</template>
	</section>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getPublicProfile } from '../../services/userService.js'
import { getProfileImageUrl } from '../../utils/media.js'
import { formatCount } from '../../utils/format.js'
import RecipeCard from '../../components/RecipeCard.vue'
import FollowButton from '../../components/FollowButton.vue'

const route = useRoute()
const router = useRouter()
const profile = ref(null)
const loading = ref(true)
const error = ref('')

async function load() {
	loading.value = true
	error.value = ''
	try {
		profile.value = (await getPublicProfile(route.params.id)).data
	} catch (requestError) {
		error.value = requestError.message || 'Perfil não encontrado.'
	} finally {
		loading.value = false
	}
}

function openRecipe(item) {
	router.push({ name: 'recipe-detail', params: { id: item.id } })
}

watch(() => route.params.id, (id) => { if (id) load() }, { immediate: true })
</script>

<style scoped>
.profile-stats {
	display: flex;
	flex-wrap: wrap;
	gap: 1.25rem;
	margin-top: .5rem;
	color: #6c5f59;
	font-size: .92rem;
}

.profile-stats strong {
	color: #332c29;
}

.profile-stats__link {
	color: inherit;
	text-decoration: none;
	border-bottom: 1px dashed transparent;
	transition: color .2s ease, border-color .2s ease;
}

.profile-stats__link:hover {
	color: var(--brand-dark);
	border-color: currentColor;
}
</style>
