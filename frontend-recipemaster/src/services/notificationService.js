import api from './api.js'
import { PAGE_SIZE } from '../config/constants.js'

export function getNotifications(page = 1, limit = PAGE_SIZE) {
  return api.get('/notifications', { params: { page, limit } })
}

export function getUnreadCount() {
  return api.get('/notifications/unread-count')
}

export function markNotificationAsRead(id) {
  return api.patch(`/notifications/${id}/read`)
}
