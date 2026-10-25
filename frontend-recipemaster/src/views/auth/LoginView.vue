<template>
	<main class="login-page">
		<section class="login-visual" aria-label="Comunidade Panelinha">
			<img class="visual-food" :src="foodImage" alt="Refeições caseiras prontas para compartilhar">
			<div class="visual-wash"></div>
			<img class="visual-people" :src="peopleImage" alt="Pessoas reunidas à mesa">
			<p class="visual-message">ONDE CADA PRATO CONTA UMA HISTÓRIA.</p>
		</section>

		<section class="login-panel">
			<div class="login-content">
				<img class="panelinha-logo" :src="logoImage" alt="Panelinha">
				<div v-if="errorMessage" class="login-error" role="alert">
					{{ errorMessage }}
				</div>

				<FormCard title="Acesse sua conta" subtitle="Entre para encontrar e compartilhar receitas.">
					<form class="login-form" @submit.prevent="handleLogin">
						<BaseInput id="email" v-model="form.email" label="E-mail" type="email" required autocomplete="email" />
						<BaseInput id="password" v-model="form.password" label="Senha" type="password" required autocomplete="current-password" />
						<BaseButton type="submit" class="w-100 mt-2" :disabled="loading">
							{{ loading ? 'Entrando...' : 'Entrar' }}
						</BaseButton>
					</form>

					<p class="register-prompt">
					<span>Ainda não tem uma conta?</span>
					<router-link to="/register">Criar conta</router-link>
					</p>
				</FormCard>
			</div>
		</section>
	</main>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import BaseButton from '../../components/base/BaseButton.vue'
import BaseInput from '../../components/base/BaseInput.vue'
import FormCard from '../../components/base/FormCard.vue'
import { useAuth } from '../../composables/useAuth.js'
import foodImage from '../../../img/download.jpg'
import logoImage from '../../../img/panelinha.png'
import peopleImage from '../../../img/povao.png'

const { authStore, loading } = useAuth()
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

<style scoped>
.login-page {
	display: grid;
	grid-template-columns: 60% 40%;
	min-height: 100vh;
	background: #ffbb62;
	font-family: "Trebuchet MS", Verdana, sans-serif;
}

.login-visual {
	position: relative;
	overflow: hidden;
	background: #f58a00;
}

.visual-food,
.visual-wash,
.visual-people {
	position: absolute;
	inset: 0;
	width: 100%;
	height: 100%;
}

.visual-food {
	object-fit: cover;
	opacity: .22;
	mix-blend-mode: multiply;
}

.visual-wash {
	background: #f58a00;
	mix-blend-mode: color;
	opacity: .55;
}

.visual-people {
	object-fit: cover;
	object-position: center bottom;
	mix-blend-mode: multiply;
	transform: scale(1.08);
}

.visual-message {
	position: absolute;
	top: 50%;
	left: 50%;
	z-index: 1;
	width: 90%;
	margin: 0;
	color: #fff;
	font-size: clamp(1.8rem, 3.4vw, 4rem);
	font-weight: 900;
	line-height: 1.03;
	text-align: center;
	transform: translate(-50%, -50%) rotate(-39deg);
}

.login-panel {
	display: flex;
	align-items: flex-start;
	justify-content: center;
	padding: clamp(3rem, 10vh, 6rem) clamp(2rem, 5vw, 5rem);
	background: #ffbb62;
}

.login-content {
	width: min(100%, 445px);
}

.panelinha-logo {
	display: block;
	width: 145px;
	height: auto;
	margin-bottom: 1.8rem;
}

h1 {
	margin: 0 0 2.25rem;
	color: #e95018;
	font-size: clamp(2rem, 2.7vw, 2.8rem);
	font-weight: 900;
	line-height: 1.1;
	text-transform: uppercase;
}

.login-form {
	display: grid;
	gap: 1.25rem;
}

.field-group {
	display: grid;
	gap: .55rem;
}

label {
	color: #5b5b61;
	font-size: 1.35rem;
	font-weight: 700;
}

input {
	width: 100%;
	min-height: 3.35rem;
	padding: .65rem 1rem;
	border: 0;
	border-radius: .7rem;
	outline: 0;
	background: #fff;
	color: #3e3e42;
	font: inherit;
	font-size: 1.1rem;
	box-sizing: border-box;
}

input:focus {
	box-shadow: 0 0 0 3px rgba(233, 80, 24, .3);
}

button {
	min-height: 3.35rem;
	margin-top: 1.15rem;
	border: 0;
	border-radius: .7rem;
	background: #da6d4e;
	color: #fff;
	cursor: pointer;
	font: inherit;
	font-size: 1.45rem;
	font-weight: 900;
	transition: background-color .2s ease, transform .2s ease;
}

button:hover:not(:disabled) {
	background: #c9573c;
	transform: translateY(-1px);
}

button:disabled {
	cursor: wait;
	opacity: .7;
}

.register-prompt {
	display: grid;
	gap: .1rem;
	margin: 3.5rem 0 0;
	color: #6b7078;
	font-size: 1.18rem;
}

.register-prompt a {
	color: #de8062;
	text-decoration: none;
}

.register-prompt a:hover {
	text-decoration: underline;
}

.login-error {
	margin: -1rem 0 1.25rem;
	padding: .75rem 1rem;
	border-radius: .5rem;
	background: #fff0ed;
	color: #a83d26;
	font-size: .95rem;
}

@media (max-width: 800px) {
	.login-page {
		grid-template-columns: 1fr;
	}

	.login-visual {
		min-height: 38vh;
	}

	.visual-message {
		font-size: clamp(1.55rem, 7vw, 2.7rem);
	}

	.login-panel {
		padding-top: 2.75rem;
		padding-bottom: 3.5rem;
	}
}
</style>
