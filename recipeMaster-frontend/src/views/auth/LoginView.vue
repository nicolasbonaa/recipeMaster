<template>
	<section class="auth-page d-flex align-items-center py-5">
		<div class="container">
			<div class="row justify-content-center">
				<div class="col-12 col-md-7 col-lg-5">
					<div class="bg-white border rounded-3 shadow-sm p-4 p-md-5">
						<div class="text-center mb-4">
							<p class="text-uppercase small fw-semibold text-secondary mb-2">Recipe Master</p>
							<h1 class="h3 mb-2">Entrar na sua conta</h1>
							<p class="text-body-secondary mb-0">Continue descobrindo e compartilhando receitas.</p>
						</div>

						<div v-if="errorMessage" class="alert alert-danger" role="alert">
							{{ errorMessage }}
						</div>

						<form @submit.prevent="handleLogin">
							<div class="mb-3">
								<label for="email" class="form-label">E-mail</label>
								<input id="email" v-model="form.email" type="email" class="form-control" required autocomplete="email">
							</div>

							<div class="mb-4">
								<label for="password" class="form-label">Senha</label>
								<input id="password" v-model="form.password" type="password" class="form-control" required autocomplete="current-password">
							</div>

							<button type="submit" class="btn btn-brand w-100" :disabled="authStore.loading">
								{{ authStore.loading ? 'Entrando...' : 'Entrar' }}
							</button>
						</form>

						<p class="text-center text-body-secondary mt-4 mb-0">
							Ainda não tem uma conta?
							<router-link class="brand-link fw-semibold" to="/register">Criar conta</router-link>
						</p>
					</div>
				</div>
			</div>
		</div>
	</section>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth.js'

const authStore = useAuthStore()
const router = useRouter()
const route = useRoute()
const form = ref({ email: '', password: '' })
const errorMessage = ref('')

async function handleLogin() {
	errorMessage.value = ''

	try {
		await authStore.login(form.value)
		await router.push(typeof route.query.redirect === 'string' ? route.query.redirect : { name: 'feed' })
	} catch (error) {
		errorMessage.value = error.message || 'E-mail ou senha inválidos.'
	}
}
</script>
