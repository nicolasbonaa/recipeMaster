import api from './api.js'

// silent: true — o erro aparece dentro do modal de denúncia, não em toast.
export function reportRecipe(recipeId, reason) {
  return api.post(`/recipes/${recipeId}/report`, { reason }, { silent: true })
}
