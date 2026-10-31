<template>
  <div class="follow-button-wrap">
    <button
      class="btn follow-button"
      :class="following ? 'btn-outline-secondary follow-button--active' : 'btn-brand'"
      type="button"
      :disabled="isBusy"
      :aria-pressed="following"
      @click="handleClick"
    >
      <i class="bi me-1" :class="following ? 'bi-person-check' : 'bi-person-plus'" aria-hidden="true"></i>
      <span class="follow-button__label">{{ following ? 'Seguindo' : 'Seguir' }}</span>
      <span v-if="following" class="follow-button__hover">Deixar de seguir</span>
    </button>
    <p v-if="error" class="follow-button__error" role="alert">{{ error }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth.js'
import { toggleFollow } from '../services/followService.js'

const props = defineProps({
  userId: { type: [Number, String], required: true },
})

// Estado COMPARTILHADO com o pai (v-model:following / v-model:followers-count):
// quando o botão muda, o contador do cartão do perfil muda junto.
const following = defineModel('following', { type: Boolean, default: false })
const followersCount = defineModel('followersCount', { type: Number, default: 0 })

const route = useRoute()
const router = useRouter()
const { isAuthenticated } = useAuth()
const isBusy = ref(false)
const error = ref('')

async function handleClick() {
  // Visitante: vai para o login e volta para este perfil depois de entrar.
  if (!isAuthenticated.value) {
    router.push({ name: 'login', query: { redirect: route.fullPath } })
    return
  }
  if (isBusy.value) return

  // 1) Guarda o estado anterior (para o rollback).
  const previousFollowing = following.value
  const previousCount = followersCount.value

  // 2) Atualiza na hora (otimista). O novo estado fica numa variável LOCAL:
  //    com defineModel, following.value só reflete a atribuição depois que o pai
  //    atualizar a prop, então lê-lo logo após atribuir devolveria o valor antigo.
  const nowFollowing = !previousFollowing
  following.value = nowFollowing
  followersCount.value = Math.max(previousCount + (nowFollowing ? 1 : -1), 0)
  error.value = ''
  isBusy.value = true

  try {
    // 3) Confirma com o servidor e adota os valores reais.
    const response = await toggleFollow(props.userId)
    following.value = response.data.isFollowing
    followersCount.value = response.data.followersCount
  } catch (requestError) {
    // Rollback: volta exatamente para o que era antes do clique.
    following.value = previousFollowing
    followersCount.value = previousCount
    error.value = requestError.message || 'Não foi possível atualizar. Tente novamente.'
  } finally {
    isBusy.value = false
  }
}
</script>

<style scoped>
.follow-button-wrap {
  display: grid;
  justify-items: end;
  gap: .35rem;
}

.follow-button {
  min-width: 150px;
  transition: transform .15s ease, background-color .2s ease, color .2s ease, border-color .2s ease;
}

.follow-button:active:not(:disabled) {
  transform: scale(.96);
}

.follow-button__hover {
  display: none;
}

.follow-button--active:hover:not(:disabled) {
  color: #b42318;
  border-color: #b42318;
  background: #fff1f0;
}

.follow-button--active:hover:not(:disabled) .follow-button__label {
  display: none;
}

.follow-button--active:hover:not(:disabled) .follow-button__hover {
  display: inline;
}

.follow-button__error {
  margin: 0;
  max-width: 260px;
  color: #b42318;
  font-size: .85rem;
  text-align: right;
}
</style>
