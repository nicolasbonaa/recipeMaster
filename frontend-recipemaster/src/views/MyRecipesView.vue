<template>
	<section class="feed-page">
		<header class="feed-header"><div><p class="eyebrow">Sua cozinha</p><h1>Meus itens</h1><p class="feed-intro">Gerencie as receitas que você publicou.</p></div><router-link class="btn btn-brand" to="/receitas/upload">Novo item</router-link></header>
		<div v-if="loading" class="feed-state">Carregando seus itens...</div>
		<div v-else-if="error" class="alert alert-danger">{{ error }}</div>
		<div v-else-if="!recipes.length" class="feed-state">Você ainda não publicou itens. <router-link to="/receitas/upload">Publique o primeiro.</router-link></div>
		<div v-else class="recipe-grid">
			<RecipeCard v-for="recipe in recipes" :key="recipe.id" :recipe="recipe" @select="openRecipe">
				<template #actions><button class="btn btn-sm btn-outline-secondary" type="button" @click.stop="router.push({ name: 'edit-recipe', params: { id: recipe.id } })">Editar</button><button class="btn btn-sm btn-outline-danger" type="button" @click.stop="askDelete(recipe)">Excluir</button></template>
			</RecipeCard>
		</div>
		<BaseModal :open="Boolean(recipeToDelete)" title="Excluir item" @close="closeDelete">
			<p>Esta ação remove o item e sua imagem permanentemente.</p>
			<div class="d-flex justify-content-end gap-2"><button class="btn btn-outline-secondary" type="button" @click="closeDelete">Cancelar</button><button class="btn btn-danger" type="button" :disabled="deleting" @click="confirmDelete">{{ deleting ? 'Excluindo...' : 'Excluir' }}</button></div>
		</BaseModal>
	</section>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import RecipeCard from '../components/RecipeCard.vue'
import BaseModal from '../components/base/BaseModal.vue'
import { deleteRecipe, getMyRecipes } from '../services/recipeService.js'

const router = useRouter(); const recipes = ref([]); const loading = ref(true); const error = ref(''); const recipeToDelete = ref(null); const deleting = ref(false)
async function loadRecipes() { try { recipes.value = (await getMyRecipes()).data || [] } catch (requestError) { error.value = requestError.message || 'Não foi possível carregar seus itens.' } finally { loading.value = false } }
function openRecipe(recipe) { router.push({ name: 'recipe-detail', params: { id: recipe.id } }) }
function askDelete(recipe) { recipeToDelete.value = recipe }
function closeDelete() { if (!deleting.value) recipeToDelete.value = null }
async function confirmDelete() { deleting.value = true; try { await deleteRecipe(recipeToDelete.value.id); recipes.value = recipes.value.filter((recipe) => recipe.id !== recipeToDelete.value.id); closeDelete() } catch (requestError) { error.value = requestError.message || 'Não foi possível excluir o item.' } finally { deleting.value = false } }
onMounted(loadRecipes)
</script>