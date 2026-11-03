import api from './api.js'

export function getMyCollections() { return api.get('/my-collections') }
export function createCollection(data) { return api.post('/collections', data, { silent: true }) }
export function getCollection(id) { return api.get(`/collections/${id}`) }
export function deleteCollection(id) { return api.delete(`/collections/${id}`) }
export function getRecipeCollectionsStatus(recipeId) { return api.get(`/recipes/${recipeId}/collections-status`) }
export function addRecipeToCollection(collectionId, recipeId) {
  return api.post(`/collections/${collectionId}/recipes`, { recipeId })
}
export function removeRecipeFromCollection(collectionId, recipeId) {
  return api.delete(`/collections/${collectionId}/recipes/${recipeId}`)
}
