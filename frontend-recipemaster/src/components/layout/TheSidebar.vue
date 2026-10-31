<template>
	<aside v-if="isAuthenticated" class="sidebar border-end bg-white p-3">
		<p class="text-uppercase small fw-semibold text-secondary mb-3">Navegação</p>
		<nav class="nav nav-pills flex-column gap-1">
			<router-link class="nav-link" to="/feed"><i class="bi bi-house me-2"></i>Feed</router-link>
			<router-link id="sidebar-following" class="nav-link" to="/seguindo"><i class="bi bi-people me-2"></i>Seguindo</router-link>
			<router-link class="nav-link" to="/search"><i class="bi bi-search me-2"></i>Buscar receitas</router-link>
			<router-link class="nav-link" to="/receitas/upload"><i class="bi bi-plus-circle me-2"></i>Publicar receita</router-link>
			<router-link class="nav-link" to="/minhas-receitas"><i class="bi bi-journal-text me-2"></i>Minhas receitas</router-link>
			<router-link class="nav-link" to="/favoritos"><i class="bi bi-heart me-2"></i>Itens curtidos</router-link>
			<router-link class="nav-link" to="/perfil"><i class="bi bi-person me-2"></i>Meu perfil</router-link>
		</nav>
	</aside>
</template>

<script setup>
import { useAuth } from '../../composables/useAuth.js'

const { isAuthenticated } = useAuth()
</script>