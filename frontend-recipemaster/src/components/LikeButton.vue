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
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth.js'
import { toggleLike } from '../services/likeService.js'
import { formatCount } from '../utils/format.js'
import { useAuthenticatedAction } from '../composables/useAuthenticatedAction.js'
import { runOptimistic } from '../utils/optimistic.js'

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
const { isBusy, execute } = useAuthenticatedAction(() => toggleLike(props.recipeId))

watch(() => props.initialLiked, (value) => { liked.value = value })
watch(() => props.initialCount, (value) => { likesCount.value = value })

async function handleClick() {
  if (!isAuthenticated.value) {
    router.push({ name: 'login', query: { redirect: route.fullPath } })
    return
  }

  const previousLiked = liked.value
  const nowLiked = !previousLiked
  const previousCount = likesCount.value
  await runOptimistic({
    apply: () => {
      liked.value = nowLiked
      likesCount.value = Math.max(previousCount + (nowLiked ? 1 : -1), 0)
      return () => { liked.value = previousLiked; likesCount.value = previousCount }
    },
    request: execute,
    confirm: (data) => {
      liked.value = data.liked
      likesCount.value = data.likesCount
      emit('change', { liked: liked.value, likesCount: likesCount.value })
    }
  })
}
</script>
