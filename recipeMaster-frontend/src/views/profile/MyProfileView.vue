<template>
	<div class="container py-4">
		<h1 class="h3">Meu perfil</h1>
		<p v-if="profile" class="text-body-secondary">Olá, {{ profile.fullName || profile.username }}.</p>
		<p v-else class="text-body-secondary">Carregando perfil...</p>
	</div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import api from '../../services/api.js'

const profile = ref(null)

onMounted(async () => {
	try {
		const response = await api.get('/profile/me')
		profile.value = response.data
		console.log('Perfil autenticado OK:', profile.value)
	} catch (error) {
		console.error('Erro ao carregar perfil:', error)
	}
})
</script>
