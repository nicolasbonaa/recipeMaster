import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getUnreadCount } from '../services/notificationService.js'
import { NOTIFICATIONS } from '../config/constants.js'

export const useNotificationsStore = defineStore('notifications', () => {
  const unreadCount = ref(0)
  let timerId = null
  // Cada pergunta ao servidor ganha um número; só a mais recente pode escrever no contador.
  let lastRefreshId = 0

  async function refresh() {
    const callId = ++lastRefreshId
    try {
      const response = await getUnreadCount()
      if (callId === lastRefreshId) unreadCount.value = response.data.unreadCount
    } catch {
      // Vazio de propósito: o polling não avisa nada; um 401 já é tratado pelo interceptor.
    }
  }

  // Valor que veio de uma ação (ex.: marcar como lida). Também sobe o lastRefreshId:
  // uma resposta velha do polling que chegue depois não pode sobrescrever o número novo.
  function setUnreadCount(value) {
    lastRefreshId++
    unreadCount.value = Math.max(0, value)
  }

  // Ajuste relativo (otimista e o seu desfazer): -1 ao marcar, +1 no rollback.
  function changeUnreadCount(delta) {
    setUnreadCount(unreadCount.value + delta)
  }

  // Aba escondida não pergunta; ao voltar a ficar visível, pergunta na hora.
  function refreshIfVisible() {
    if (document.visibilityState === 'visible') refresh()
  }

  function startPolling() {
    if (timerId !== null) return // já está ligado: nunca dois temporizadores
    refresh()
    timerId = setInterval(refreshIfVisible, NOTIFICATIONS.POLL_MS)
    document.addEventListener('visibilitychange', refreshIfVisible)
  }

  function stopPolling() {
    if (timerId !== null) {
      clearInterval(timerId)
      timerId = null
    }
    // A MESMA referência usada no addEventListener.
    document.removeEventListener('visibilitychange', refreshIfVisible)
    lastRefreshId++ // descarta qualquer resposta que ainda esteja a caminho
    unreadCount.value = 0
  }

  return { unreadCount, refresh, setUnreadCount, changeUnreadCount, refreshIfVisible, startPolling, stopPolling }
})
