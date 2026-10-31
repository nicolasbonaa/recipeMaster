<template>
	<section class="feed-page">
		<router-link
			v-if="profile"
			id="follow-list-back"
			class="detail-back"
			:to="{ name: 'public-profile', params: { id: profile.username } }"
		>
			<i class="bi bi-arrow-left me-1"></i>Voltar ao perfil
		</router-link>

		<header class="feed-header">
			<div>
				<p class="eyebrow">{{ profile ? `@${profile.username}` : 'Perfil' }}</p>
				<h1>{{ kind === 'followers' ? 'Seguidores' : 'Seguindo' }}</h1>
			</div>
		</header>

		<!-- Abas: a ativa vem da prop kind (definida na rota), não de um estado local. -->
		<nav class="follow-tabs" aria-label="Seguidores e seguindo">
			<router-link
				id="tab-followers"
				class="follow-tabs__tab"
				:class="{ 'follow-tabs__tab--active': kind === 'followers' }"
				:to="{ name: 'profile-followers', params: { id: username } }"
				replace
			>
				Seguidores<span v-if="profile" class="follow-tabs__count">{{ formatCount(profile.followersCount) }}</span>
			</router-link>
			<router-link
				id="tab-following"
				class="follow-tabs__tab"
				:class="{ 'follow-tabs__tab--active': kind === 'following' }"
				:to="{ name: 'profile-following', params: { id: username } }"
				replace
			>
				Seguindo<span v-if="profile" class="follow-tabs__count">{{ formatCount(profile.followingCount) }}</span>
			</router-link>
		</nav>

		<div v-if="loading" class="feed-state">Carregando...</div>
		<div v-else-if="error" class="alert alert-danger">{{ error }}</div>
		<div v-else-if="users.length === 0" class="feed-state">{{ emptyMessage }}</div>

		<ul v-else class="follow-list">
			<li v-for="person in users" :key="person.id">
				<router-link class="follow-list__item" :to="{ name: 'public-profile', params: { id: person.username } }">
					<img :src="getProfileImageUrl(person.profilePicture)" alt="" class="follow-list__avatar">
					<div class="follow-list__info">
						<strong>{{ person.fullName || person.username }}</strong>
						<span>@{{ person.username }}</span>
						<small v-if="person.bio">{{ person.bio }}</small>
					</div>
					<span class="follow-list__meta">{{ formatCount(person.followersCount) }} seguidores</span>
					<i class="bi bi-chevron-right follow-list__chevron" aria-hidden="true"></i>
				</router-link>
			</li>
		</ul>
	</section>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { getPublicProfile } from '../../services/userService.js'
import { getFollowers, getFollowing } from '../../services/followService.js'
import { getProfileImageUrl } from '../../utils/media.js'
import { formatCount } from '../../utils/format.js'

// kind vem da definição da rota: props: { kind: 'followers' } ou { kind: 'following' }
const props = defineProps({
	kind: { type: String, required: true, validator: (value) => ['followers', 'following'].includes(value) },
})

const route = useRoute()
const profile = ref(null)
const users = ref([])
const loading = ref(true)
const error = ref('')

// O parâmetro :id destas rotas é o username (mesmo padrão do perfil público).
const username = computed(() => route.params.id)

const emptyMessage = computed(() => {
	const name = profile.value?.fullName || profile.value?.username || 'Esta pessoa'
	return props.kind === 'followers'
		? `${name} ainda não tem seguidores.`
		: `${name} ainda não segue ninguém.`
})

async function loadList() {
	if (!username.value) return
	loading.value = true
	error.value = ''
	users.value = []
	try {
		// 1) A rota tem o username, mas a API de listas usa o id: primeiro o perfil...
		profile.value = (await getPublicProfile(username.value)).data
		// 2) ...depois a lista certa, com o id do perfil.
		const response = props.kind === 'followers'
			? await getFollowers(profile.value.id)
			: await getFollowing(profile.value.id)
		users.value = response.data || []
	} catch (requestError) {
		profile.value = null
		error.value = requestError.message || 'Não foi possível carregar a lista.'
	} finally {
		loading.value = false
	}
}

// Trocar de aba (kind) ou de pessoa (username) reaproveita o mesmo componente: recarrega.
watch(() => [props.kind, route.params.id], loadList, { immediate: true })
</script>

<style scoped>
.follow-tabs {
	display: flex;
	gap: .25rem;
	margin-bottom: 1.5rem;
	border-bottom: 1px solid #eaded8;
}

.follow-tabs__tab {
	display: inline-flex;
	align-items: center;
	gap: .5rem;
	padding: .75rem 1.1rem;
	margin-bottom: -1px;
	color: #6c5f59;
	font-weight: 600;
	text-decoration: none;
	border-bottom: 3px solid transparent;
	transition: color .2s ease, border-color .2s ease;
}

.follow-tabs__tab:hover {
	color: var(--brand-dark);
}

.follow-tabs__tab--active {
	color: var(--brand-dark);
	border-color: var(--brand-color);
}

.follow-tabs__count {
	padding: .05rem .5rem;
	font-size: .78rem;
	background: var(--brand-soft);
	border-radius: 999px;
}

.follow-list {
	display: grid;
	gap: .65rem;
	padding: 0;
	margin: 0;
	list-style: none;
}

.follow-list__item {
	display: flex;
	align-items: center;
	gap: 1rem;
	padding: .9rem 1.1rem;
	color: inherit;
	text-decoration: none;
	background: #fff;
	border: 1px solid #eaded8;
	border-radius: 8px;
	transition: transform .15s ease, box-shadow .2s ease, border-color .2s ease;
}

.follow-list__item:hover {
	transform: translateY(-2px);
	border-color: var(--brand-soft);
	box-shadow: 0 10px 24px rgba(77, 48, 38, .1);
}

.follow-list__avatar {
	width: 52px;
	height: 52px;
	flex-shrink: 0;
	object-fit: cover;
	border-radius: 50%;
	border: 3px solid var(--brand-soft);
}

.follow-list__info {
	display: grid;
	min-width: 0;
}

.follow-list__info span,
.follow-list__info small {
	overflow: hidden;
	color: #8a7971;
	text-overflow: ellipsis;
	white-space: nowrap;
}

.follow-list__meta {
	margin-left: auto;
	color: #8a7971;
	font-size: .85rem;
	white-space: nowrap;
}

.follow-list__chevron {
	color: #c4b5ae;
}
</style>
