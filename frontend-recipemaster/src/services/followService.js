import api from './api.js'
import { PAGE_SIZE } from '../config/constants.js'

export function toggleFollow(userId) {
  return api.post(`/users/${userId}/toggle-follow`)
}

export function getFollowers(userId) {
  return api.get(`/users/${userId}/followers`)
}

export function getFollowing(userId) {
  return api.get(`/users/${userId}/following`)
}

export function getFollowingRecipes(page = 1, limit = PAGE_SIZE) {
  return api.get('/following-recipes', { params: { page, limit } })
}
