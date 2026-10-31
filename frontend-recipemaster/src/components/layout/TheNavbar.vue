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
					<template v-if="isAuthenticated">
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
import { onMounted, ref, watch } from 'vue'
import { useClickOutside } from '../../composables/useClickOutside.js'

const { authStore, isAuthenticated } = useAuth()
const router = useRouter()
const avatarMenu = ref(null)
const menuOpen = ref(false)
const profile = ref(null)

useClickOutside(avatarMenu, () => { menuOpen.value = false })
async function loadProfile() {
	if (!isAuthenticated.value) return
	try { profile.value = (await getMyProfile()).data } catch { profile.value = null }
}
onMounted(loadProfile)
watch(isAuthenticated, loadProfile)
function closeMenu() { menuOpen.value = false }

function handleLogout() {
	closeMenu()
	authStore.logout()
	router.push({ name: 'login' })
}
</script>
