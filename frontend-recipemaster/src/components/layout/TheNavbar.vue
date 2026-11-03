<template>
	<nav class="navbar navbar-expand-lg bg-white border-bottom">
		<div class="container-fluid px-4">
			<router-link class="navbar-brand fw-bold brand-link" to="/">Recipe Master</router-link>

			<button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#mainNavigation" aria-controls="mainNavigation" aria-label="Abrir menu">
				<span class="navbar-toggler-icon"></span>
			</button>

			<div id="mainNavigation" class="collapse navbar-collapse">
				<div class="navbar-nav me-auto">
					<router-link v-if="isAuthenticated" class="nav-link" to="/feed"><i class="bi bi-house me-1"></i>Feed</router-link>
					<router-link v-if="isAuthenticated" class="nav-link" to="/search"><i class="bi bi-search me-1"></i>Buscar</router-link>
					<router-link v-if="isAuthenticated" class="nav-link" to="/minhas-receitas"><i class="bi bi-journal-text me-1"></i>Minhas receitas</router-link>
				</div>

				<div class="d-flex align-items-center gap-2">
					<form class="input-group input-group-sm navbar-search" role="search" @submit.prevent="submitSearch">
						<input v-model="searchText" class="form-control" type="search" placeholder="Buscar receitas ou pessoas" aria-label="Buscar receitas ou pessoas" />
						<button class="btn btn-outline-secondary" type="submit" aria-label="Buscar"><i class="bi bi-search"></i></button>
					</form>
					<template v-if="isAuthenticated">
						<router-link
							class="btn btn-outline-secondary btn-sm position-relative notification-bell"
							:to="{ name: 'notifications' }"
							:aria-label="bellLabel"
							:title="bellLabel"
						>
							<i class="bi bi-bell" aria-hidden="true"></i>
							<span
								v-if="unreadCount > 0"
								class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
								aria-hidden="true"
							>{{ badgeText }}</span>
						</router-link>
						<div ref="avatarMenu" class="avatar-menu">
							<button class="avatar-button" type="button" aria-label="Abrir menu do perfil" :aria-expanded="menuOpen" @click.stop="menuOpen = !menuOpen">
								<img :src="getProfileImageUrl(profile?.profilePicture)" alt="" />
								<span>{{ profile?.username || 'Perfil' }}</span>
								<i class="bi bi-chevron-down" aria-hidden="true"></i>
							</button>
							<div v-if="menuOpen" class="avatar-menu__panel">
								<router-link to="/perfil" @click="closeMenu">Editar Perfil</router-link>
								<router-link v-if="profile?.username" :to="{ name: 'public-profile', params: { id: profile.username } }" @click="closeMenu">Ver Perfil</router-link>
								<router-link to="/minhas-receitas" @click="closeMenu">Meus Itens</router-link>
								<router-link to="/minhas-colecoes" @click="closeMenu">Minhas Coleções</router-link>
								<button type="button" @click="handleLogout">Sair</button>
							</div>
						</div>
					</template>
					<template v-else>
						<router-link class="btn btn-outline-secondary btn-sm" to="/login">Entrar</router-link>
						<router-link class="btn btn-brand btn-sm" to="/register">Criar conta</router-link>
					</template>
				</div>
			</div>
		</div>
	</nav>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useAuth } from '../../composables/useAuth.js'
import { getMyProfile } from '../../services/userService.js'
import { getProfileImageUrl } from '../../utils/media.js'
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { useClickOutside } from '../../composables/useClickOutside.js'
import { useNotificationsStore } from '../../stores/notifications.js'
import { logout as logoutRequest } from '../../services/authService.js'

const { authStore, isAuthenticated } = useAuth()
const router = useRouter()
const avatarMenu = ref(null)
const menuOpen = ref(false)
const profile = ref(null)
const searchText = ref('')
const notificationsStore = useNotificationsStore()
const unreadCount = computed(() => notificationsStore.unreadCount)
const badgeText = computed(() => (unreadCount.value > 99 ? '99+' : String(unreadCount.value)))
const bellLabel = computed(() => {
	const count = unreadCount.value
	if (count === 0) return 'Notificações (nenhuma não lida)'
	return `Notificações (${count} ${count === 1 ? 'não lida' : 'não lidas'})`
})

// Liga ao entrar na conta e desliga ao sair (immediate: vale também para quem já chega logado).
watch(isAuthenticated, (logged) => {
	if (logged) notificationsStore.startPolling()
	else notificationsStore.stopPolling()
}, { immediate: true })
onUnmounted(() => notificationsStore.stopPolling())

useClickOutside(avatarMenu, () => { menuOpen.value = false })
async function loadProfile() {
	if (!isAuthenticated.value) return
	try { profile.value = (await getMyProfile()).data } catch { profile.value = null }
}
onMounted(loadProfile)
watch(isAuthenticated, loadProfile)
function closeMenu() { menuOpen.value = false }
function submitSearch() {
	const query = searchText.value.trim()
	if (!query) return
	router.push({ name: 'search', query: { q: query } })
	searchText.value = ''
}

async function handleLogout() {
	closeMenu()
	try { await logoutRequest() } catch { /* silent: sair da conta não depende da resposta */ }
	notificationsStore.stopPolling()
	authStore.logout()
	router.push({ name: 'login' })
}
</script>
