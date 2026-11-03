import api from './api.js'
import { PAGE_SIZE } from '../config/constants.js'

export function createRecipe(formData, onUploadProgress) {
  return api.post('/recipes', formData, {
    onUploadProgress,
    silent: true,
  })
}

export function getFeed(page = 1, limit = PAGE_SIZE) {
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
    silent: true,
  })
}

export function deleteRecipe(id) {
  return api.delete(`/recipes/${id}`)
}