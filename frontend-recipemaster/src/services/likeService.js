import api from './api.js'

export function toggleLike(recipeId) {
  return api.post(`/recipes/${recipeId}/toggle-like`)
}

export function getLikeStatus(recipeId) {
  return api.get(`/recipes/${recipeId}/like-status`)
}

export function getLikedRecipes() {
  return api.get('/liked-recipes')
}
