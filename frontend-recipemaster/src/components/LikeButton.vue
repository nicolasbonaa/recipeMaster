<template>
  <button
    class="like-button"
    :class="{ 'like-button--active': liked }"
    type="button"
    :disabled="isBusy"
    :aria-pressed="liked"
    @click="handleClick"
  >
    <span aria-hidden="true">{{ liked ? '♥' : '♡' }}</span>
    <span>{{ formatCount(likesCount) }}</span>
    <span class="visually-hidden">{{ liked ? 'Descurtir' : 'Curtir' }}</span>
  </button>
  <p v-if="error" class="like-button__error" role="alert">{{ error }}</p>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth.js'
import { toggleLike } from '../services/likeService.js'
import { formatCount } from '../utils/format.js'

const props = defineProps({
  recipeId: { type: [Number, String], required: true },
  initialLiked: { type: Boolean, default: false },
  initialCount: { type: Number, default: 0 },
})

const emit = defineEmits(['change'])
const route = useRoute()
const router = useRouter()
const { isAuthenticated } = useAuth()
const liked = ref(props.initialLiked)
const likesCount = ref(props.initialCount)
const isBusy = ref(false)
const error = ref('')

watch(() => props.initialLiked, (value) => { liked.value = value })
watch(() => props.initialCount, (value) => { likesCount.value = value })

async function handleClick() {
  if (!isAuthenticated.value) {
    router.push({ name: 'login', query: { redirect: route.fullPath } })
    return
  }

  const previousLiked = liked.value
  const previousCount = likesCount.value
  liked.value = !previousLiked
  likesCount.value = Math.max(previousCount + (liked.value ? 1 : -1), 0)
  error.value = ''
  isBusy.value = true

  try {
    const response = await toggleLike(props.recipeId)
    liked.value = response.data.liked
    likesCount.value = response.data.likesCount
    emit('change', { liked: liked.value, likesCount: likesCount.value })
  } catch (requestError) {
    liked.value = previousLiked
    likesCount.value = previousCount
    error.value = requestError.message || 'Não foi possível atualizar a curtida.'
  } finally {
    isBusy.value = false
  }
}
</script>
