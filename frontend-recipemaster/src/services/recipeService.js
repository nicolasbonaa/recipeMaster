import api from './api.js'

export function createRecipe(formData, onUploadProgress) {
  return api.post('/recipes', formData, {
    onUploadProgress,
  })
}

export function getFeed(page = 1, limit = 6) {
  return api.get('/feed', { params: { page, limit } })
}

export function getRecipeById(id) {
  return api.get(`/recipes/${id}`)
}

export function getMyRecipes() {
  return api.get('/my-recipes')
}

export function getRecipeForEdit(id) {
  return api.get(`/recipes/${id}/edit`)
}

export function updateRecipe(id, formData) {
  return api.put(`/recipes/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
}

export function deleteRecipe(id) {
  return api.delete(`/recipes/${id}`)
}