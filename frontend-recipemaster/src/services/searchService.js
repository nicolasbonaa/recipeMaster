import api from './api.js'

export function search(query) {
  return api.get('/search', { params: { q: query } })
}
