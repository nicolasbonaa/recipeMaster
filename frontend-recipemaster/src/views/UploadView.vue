<template>
	<section class="upload-page p-4 p-lg-5">
		<div class="upload-header mb-4">
			<p class="text-uppercase small fw-semibold text-secondary mb-2">Nova publicação</p>
			<h1 class="h2 mb-2">Compartilhe uma receita</h1>
			<p class="text-secondary mb-0">Registre os ingredientes, o preparo e uma imagem para a comunidade.</p>
		</div>

		<form class="upload-form" @submit.prevent="handleSubmit" novalidate>
			<div class="mb-3">
				<label class="form-label" for="title">Título</label>
				<input id="title" v-model.trim="form.title" class="form-control" :class="{ 'is-invalid': errors.title }" maxlength="120" placeholder="Ex.: Risoto de cogumelos" />
				<div v-if="errors.title" class="invalid-feedback">{{ errors.title }}</div>
			</div>

			<div class="mb-3">
				<label class="form-label" for="description">Descrição</label>
				<textarea id="description" v-model.trim="form.description" class="form-control" :class="{ 'is-invalid': errors.description }" maxlength="500" rows="5" placeholder="Conte um pouco sobre o prato e o modo de preparo."></textarea>
				<div class="d-flex justify-content-between">
					<div v-if="errors.description" class="text-danger small mt-1">{{ errors.description }}</div>
					<small class="text-secondary ms-auto mt-1">{{ form.description.length }}/500</small>
				</div>
			</div>

			<div class="mb-4">
				<label class="form-label" for="image">Imagem da receita</label>
				<input id="image" ref="fileInput" class="form-control" :class="{ 'is-invalid': errors.image }" type="file" accept="image/*" @change="handleFileChange" />
				<div v-if="errors.image" class="invalid-feedback">{{ errors.image }}</div>
				<img v-if="previewUrl" class="thumbnail-preview mt-3" :src="previewUrl" alt="Prévia da imagem selecionada" />
			</div>

			<div v-if="uploading" class="mb-3" aria-live="polite">
				<div class="d-flex justify-content-between small mb-1"><span>Enviando receita...</span><strong>{{ progress }}%</strong></div>
				<div class="progress progress-track" role="progressbar" :aria-valuenow="progress" aria-valuemin="0" aria-valuemax="100">
					<div class="progress-bar" :style="{ width: `${progress}%` }"></div>
				</div>
			</div>

			<div v-if="message" class="alert" :class="success ? 'alert-success' : 'alert-danger'" role="alert">{{ message }} <router-link v-if="success" to="/minhas-receitas">Ver meus itens</router-link></div>
			<button class="btn btn-brand px-4" type="submit" :disabled="uploading">
				<span v-if="uploading" class="spinner-border spinner-border-sm me-2" aria-hidden="true"></span>
				{{ uploading ? 'Publicando...' : 'Publicar receita' }}
			</button>
		</form>
	</section>
</template>

<script setup>
import { onBeforeUnmount, reactive, ref } from 'vue'
import { createRecipe } from '../services/recipeService.js'

const form = reactive({ title: '', description: '', image: null })
const errors = reactive({ title: '', description: '', image: '' })
const fileInput = ref(null)
const previewUrl = ref('')
const uploading = ref(false)
const progress = ref(0)
const message = ref('')
const success = ref(false)

function clearErrors() {
	errors.title = ''
	errors.description = ''
	errors.image = ''
	message.value = ''
}

function handleFileChange(event) {
	const [file] = event.target.files
	form.image = file || null
	if (previewUrl.value) URL.revokeObjectURL(previewUrl.value)
	previewUrl.value = file ? URL.createObjectURL(file) : ''
	errors.image = ''
}

function validate() {
	if (!form.title) errors.title = 'O título da receita é obrigatório.'
	if (!form.description) errors.description = 'A descrição da receita é obrigatória.'
	if (!form.image) errors.image = 'A imagem da receita é obrigatória.'
	return !errors.title && !errors.description && !errors.image
}

async function handleSubmit() {
	clearErrors()
	success.value = false
	if (!validate()) return

	const data = new FormData()
	data.append('title', form.title)
	data.append('description', form.description)
	data.append('image', form.image)
	uploading.value = true
	progress.value = 0

	try {
		await createRecipe(data, (event) => {
			if (event.total) progress.value = Math.round((event.loaded * 100) / event.total)
		})
		await new Promise((resolve) => setTimeout(resolve, 2000))
		progress.value = 100
		success.value = true
		message.value = 'Receita publicada com sucesso.'
		form.title = ''
		form.description = ''
		form.image = null
		previewUrl.value = ''
		if (fileInput.value) fileInput.value.value = ''
	} catch (error) {
		message.value = error.message || 'Não foi possível publicar a receita.'
	} finally {
		uploading.value = false
	}
}

onBeforeUnmount(() => {
	if (previewUrl.value) URL.revokeObjectURL(previewUrl.value)
})
</script>