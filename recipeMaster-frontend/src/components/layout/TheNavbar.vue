<template>
	<nav class="navbar navbar-expand-lg bg-white border-bottom">
		<div class="container-fluid px-4">
			<router-link class="navbar-brand fw-bold brand-link" to="/">Recipe Master</router-link>

			<button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#mainNavigation" aria-controls="mainNavigation" aria-label="Abrir menu">
				<span class="navbar-toggler-icon"></span>
			</button>

			<div id="mainNavigation" class="collapse navbar-collapse">
				<div class="navbar-nav me-auto">
					<router-link v-if="authStore.isAuthenticated" class="nav-link" to="/feed">Feed</router-link>
					<router-link v-if="authStore.isAuthenticated" class="nav-link" to="/search">Buscar</router-link>
					<router-link v-if="authStore.isAuthenticated" class="nav-link" to="/minhas-receitas">Minhas receitas</router-link>
				</div>

				<div class="d-flex align-items-center gap-2">
					<template v-if="authStore.isAuthenticated">
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
import { useAuthStore } from '../../stores/auth.js'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

function handleLogout() {
	authStore.logout()
	router.push({ name: 'login' })
}
</script>
