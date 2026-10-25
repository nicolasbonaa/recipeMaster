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
						<router-link class="btn btn-outline-secondary btn-sm" to="/perfil">Meu perfil</router-link>
						<button class="btn btn-brand btn-sm" type="button" @click="handleLogout">Sair</button>
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

const { authStore, isAuthenticated } = useAuth()
const router = useRouter()

function handleLogout() {
	authStore.logout()
	router.push({ name: 'login' })
}
</script>
