<template>
  <section class="feed-page">
    <!--
      Alcançabilidade (Atividade 14):
      - Notificações: sino na Navbar (todas as telas, só para quem está logado).
      - Marcar como lida: botão na linha e clique na própria notificação.
      - Ir ao que gerou o aviso: clique no texto (receita para curtir/comentar, perfil para seguir).
      - Mais antigas / novas: "Carregar mais notificações" no fim e "Atualizar" no topo.
      - Denunciar: botão "Denunciar" no detalhe da receita (visitante -> login -> volta; o dono não o vê).
      Lacuna conhecida: esta lista não se atualiza sozinha; só o número do sino (polling).
    -->
    <header class="feed-header">
      <div>
        <p class="eyebrow">Atividade da sua conta</p>
        <h1>Notificações</h1>
        <p class="feed-intro">Curtidas, comentários e novos seguidores.</p>
      </div>
      <button class="btn btn-outline-secondary" type="button" :disabled="loading" @click="reload">
        <i class="bi bi-arrow-clockwise me-1"></i>Atualizar
      </button>
    </header>

    <div v-if="loading && notifications.length === 0" class="feed-state">Carregando notificações...</div>
    <div v-else-if="error && notifications.length === 0" class="alert alert-danger">{{ error }}</div>
    <div v-else-if="notifications.length === 0" class="feed-state">
      Você ainda não tem notificações. Quando alguém curtir ou comentar uma receita sua, ou começar a seguir você, o aviso aparece aqui.
    </div>

    <ul v-else class="notification-list list-unstyled">
      <li
        v-for="notification in notifications"
        :key="notification.id"
        class="notification-item"
        :class="{ 'notification-item--unread': !notification.isRead }"
      >
        <img class="notification-item__avatar" :src="getProfileImageUrl(notification.Actor?.profilePicture)" alt="" />
        <div class="notification-item__body">
          <router-link class="notification-item__text" :to="targetOf(notification)" @click="markAsRead(notification)">
            <strong>@{{ notification.Actor?.username || 'alguém' }}</strong>
            {{ NOTIFICATION_TEXT[notification.type] }}<template v-if="notification.recipe">: <em>{{ notification.recipe.title }}</em></template>
          </router-link>
          <time class="notification-item__date" :datetime="notification.createdAt">{{ formatDate(notification.createdAt) }}</time>
        </div>
        <!-- Continua na tela (desabilitado) enquanto a requisição está pendente: um segundo clique não cai em outro elemento. -->
        <button
          v-if="!notification.isRead || busyIds.has(notification.id)"
          class="btn btn-sm btn-outline-secondary"
          type="button"
          :disabled="busyIds.has(notification.id)"
          @click="markAsRead(notification)"
        >
          {{ busyIds.has(notification.id) ? 'Marcando...' : 'Marcar como lida' }}
        </button>
        <span v-else class="small text-secondary"><i class="bi bi-check2-all me-1"></i>Lida</span>
      </li>
    </ul>

    <div v-if="notifications.length > 0" class="feed-more">
      <button v-if="hasMore" class="btn btn-outline-secondary" type="button" :disabled="loading" @click="loadPage()">
        {{ loading ? 'Carregando...' : 'Carregar mais notificações' }}
      </button>
      <p v-else class="feed-end">Não há notificações mais antigas.</p>
    </div>
  </section>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { getNotifications, markNotificationAsRead } from '../services/notificationService.js'
import { usePaginatedList } from '../composables/usePaginatedList.js'
import { useNotificationsStore } from '../stores/notifications.js'
import { runOptimistic } from '../utils/optimistic.js'
import { getProfileImageUrl } from '../utils/media.js'
import { formatDate } from '../utils/format.js'
import { NOTIFICATION_TEXT } from '../config/constants.js'

const notificationsStore = useNotificationsStore()
const { items: notifications, loading, error, hasMore, loadPage } = usePaginatedList(getNotifications)

function reload() {
  loadPage(true).catch(() => {})
  notificationsStore.refresh()
}

// follow -> perfil de quem seguiu; curtir/comentar -> a receita.
function targetOf(notification) {
  if (notification.type === 'follow' || !notification.recipeId) {
    return { name: 'public-profile', params: { id: notification.Actor?.username } }
  }
  return { name: 'recipe-detail', params: { id: notification.recipeId } }
}

// "Cerca" por linha: um Set reativo com os ids que estão sendo marcados.
const busyIds = ref(new Set())
function setBusy(id, busy) {
  const next = new Set(busyIds.value)
  if (busy) next.add(id)
  else next.delete(id)
  busyIds.value = next
}

// Quarto caso do runOptimistic (sem mexer em utils/optimistic.js).
function markAsRead(notification) {
  if (notification.isRead || busyIds.value.has(notification.id)) return
  setBusy(notification.id, true)
  runOptimistic({
    apply: () => {
      notification.isRead = true
      notificationsStore.changeUnreadCount(-1)
      // Desfazer RELATIVO (+1): se outra linha também falhar, cada uma devolve só o que tirou.
      return () => {
        notification.isRead = false
        notificationsStore.changeUnreadCount(+1)
      }
    },
    request: () => markNotificationAsRead(notification.id),
    confirm: (data) => {
      notification.isRead = data.isRead
      notificationsStore.setUnreadCount(data.unreadCount)
    }
  }).finally(() => setBusy(notification.id, false))
}

onMounted(() => loadPage(true).catch(() => {}))
</script>

<style scoped>
.notification-list { display: grid; gap: .5rem; margin: 0; }
.notification-item { display: flex; align-items: center; gap: .9rem; padding: .85rem 1rem; background: #fff; border: 1px solid #eaded8; border-radius: 8px; }
.notification-item--unread { background: #fff4ef; border-color: #f0c6b4; }
.notification-item--unread .notification-item__text { font-weight: 600; }
.notification-item__avatar { width: 44px; height: 44px; flex: none; border-radius: 50%; object-fit: cover; }
.notification-item__body { display: grid; flex: 1; min-width: 0; gap: .15rem; }
.notification-item__text { color: #332c29; text-decoration: none; }
.notification-item__text:hover { text-decoration: underline; }
.notification-item__date { color: #8a7971; font-size: .8rem; }
</style>
