<template>
	<section class="container py-4">
		<div class="row justify-content-center">
			<div class="col-12 col-lg-8">
				<div class="d-flex align-items-center justify-content-between mb-4">
					<div>
						<p class="text-uppercase small fw-semibold text-secondary mb-1">Recipe Master</p>
						<h1 class="h3 mb-0">Meu perfil</h1>
					</div>
					<router-link class="btn btn-outline-secondary" to="/feed">Voltar ao feed</router-link>
				</div>

				<div v-if="loading" class="alert alert-light border">Carregando seus dados...</div>
				<div v-if="errorMessage" class="alert alert-danger">{{ errorMessage }}</div>
				<div v-if="successMessage" class="alert alert-success">{{ successMessage }}</div>

				<form v-if="profile" class="bg-white border rounded-3 shadow-sm p-4" @submit.prevent="handleSubmit">
					<div class="text-center mb-4">
						<img :src="previewUrl || getProfileImageUrl(profile.profilePicture)" alt="Foto de perfil" class="profile-image mb-3">
						<div>
							<label for="profile-photo" class="btn btn-outline-secondary">Escolher foto</label>
							<input id="profile-photo" class="d-none" type="file" accept="image/*" @change="handlePhotoChange">
						</div>
						<small class="text-body-secondary">PNG, JPG ou GIF de até 5 MB.</small>
					</div>

					<div class="mb-3">
						<label for="full-name" class="form-label">Nome completo</label>
						<input id="full-name" v-model="form.fullName" class="form-control" type="text" maxlength="100" required>
					</div>

					<div class="mb-4">
						<label for="bio" class="form-label">Bio</label>
						<textarea id="bio" v-model="form.bio" class="form-control" rows="4" maxlength="160"></textarea>
						<div class="form-text text-end">{{ form.bio.length }}/160</div>
					</div>

					<div class="d-flex justify-content-end">
						<button class="btn btn-brand" type="submit" :disabled="saving">
							{{ saving ? 'Salvando...' : 'Salvar alterações' }}
						</button>
					</div>
				</form>
			</div>
		</div>
	</section>
</template>

<script setup>
import { onBeforeUnmount, onMounted, reactive, ref } from 'vue'
import { getMyProfile, updateProfile } from '../../services/userService.js'
import { getProfileImageUrl } from '../../utils/media.js'

const profile = ref(null)
const selectedPhoto = ref(null)
const previewUrl = ref('')
const loading = ref(true)
const saving = ref(false)
const errorMessage = ref('')
const successMessage = ref('')
const form = reactive({ fullName: '', bio: '' })

async function loadProfile() {
	try {
		const response = await getMyProfile()
		profile.value = response.data
		form.fullName = response.data.fullName || ''
		form.bio = response.data.bio || ''
		console.log('Perfil autenticado OK:', profile.value)
	} catch (error) {
		errorMessage.value = error.message || 'Não foi possível carregar o perfil.'
	} finally {
		loading.value = false
	}
}

function handlePhotoChange(event) {
	const [photo] = event.target.files
	if (!photo) return

	if (!photo.type.startsWith('image/')) {
		errorMessage.value = 'Selecione um arquivo de imagem.'
		return
	}

	if (photo.size > 5 * 1024 * 1024) {
		errorMessage.value = 'A imagem deve ter no máximo 5 MB.'
		return
	}

	if (previewUrl.value) URL.revokeObjectURL(previewUrl.value)
	selectedPhoto.value = photo
	previewUrl.value = URL.createObjectURL(photo)
	errorMessage.value = ''
}

async function handleSubmit() {
	saving.value = true
	errorMessage.value = ''
	successMessage.value = ''

	try {
		const formData = new FormData()
		formData.append('fullName', form.fullName)
		formData.append('bio', form.bio)
		if (selectedPhoto.value) formData.append('photo', selectedPhoto.value)

		const response = await updateProfile(formData)
		profile.value = response.data
		selectedPhoto.value = null
		if (previewUrl.value) URL.revokeObjectURL(previewUrl.value)
		previewUrl.value = ''
		successMessage.value = 'Perfil atualizado com sucesso.'
	} catch (error) {
		errorMessage.value = error.message || 'Não foi possível atualizar o perfil.'
	} finally {
		saving.value = false
	}
}

onMounted(loadProfile)
onBeforeUnmount(() => {
	if (previewUrl.value) URL.revokeObjectURL(previewUrl.value)
})
</script>

<style scoped>
.profile-image {
	width: 128px;
	height: 128px;
	border-radius: 50%;
	object-fit: cover;
	border: 4px solid var(--brand-soft);
}
</style>
