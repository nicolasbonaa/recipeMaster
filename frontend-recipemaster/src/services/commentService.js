import api from './api.js'

export function getComments(recipeId) {
  return api.get(`/recipes/${recipeId}/comments`)
}

export function createComment(recipeId, content) {
  return api.post(`/recipes/${recipeId}/comments`, { content })
}
