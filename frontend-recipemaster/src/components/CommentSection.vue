<template>
  <section class="comments-section" aria-labelledby="comments-title">
    <div class="comments-section__heading">
      <div>
        <p class="eyebrow">Conversa da comunidade</p>
        <h2 id="comments-title">Comentários</h2>
      </div>
      <span class="comments-section__count">{{ formatCount(comments.length) }}</span>
    </div>

    <form v-if="isAuthenticated" class="comment-form" @submit.prevent="submitComment">
      <label for="comment-content">Deixe um comentário</label>
      <textarea id="comment-content" v-model="content" rows="3" maxlength="500" placeholder="Compartilhe uma ideia sobre esta receita."></textarea>
      <div class="comment-form__footer">
        <span>{{ content.length }}/500</span>
        <button class="btn btn-brand" type="submit" :disabled="isSubmitting">{{ isSubmitting ? 'Publicando...' : 'Comentar' }}</button>
      </div>
      <p v-if="formError" class="comments-section__error" role="alert">{{ formError }}</p>
    </form>
    <p v-else class="comments-section__login">Entre para participar da conversa.</p>

    <div v-if="loading" class="feed-state">Carregando comentários...</div>
    <p v-else-if="error" class="alert alert-danger" role="alert">{{ error }}</p>
    <p v-else-if="comments.length === 0" class="comments-section__empty">Ainda não há comentários.</p>
    <ol v-else class="comments-list">
      <li v-for="comment in comments" :key="comment.id" class="comment-item">
        <div class="comment-item__meta">
          <strong>{{ comment.author?.fullName || comment.author?.username || 'Usuário' }}</strong>
          <time :datetime="comment.createdAt">{{ formatDate(comment.createdAt) }}</time>
        </div>
        <p>{{ comment.content }}</p>
      </li>
    </ol>
  </section>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue'
import { useAuth } from '../composables/useAuth.js'
import { createComment, getComments } from '../services/commentService.js'
import { formatCount, formatDate } from '../utils/format.js'

const props = defineProps({
  recipeId: { type: [Number, String], required: true },
})
const emit = defineEmits(['count-change'])
const { isAuthenticated } = useAuth()
const comments = ref([])
const content = ref('')
const loading = ref(true)
const isSubmitting = ref(false)
const error = ref('')
const formError = ref('')

async function loadComments() {
  loading.value = true
  error.value = ''
  try {
    const response = await getComments(props.recipeId)
    comments.value = response.data || []
    emit('count-change', comments.value.length)
  } catch (requestError) {
    error.value = requestError.message || 'Não foi possível carregar os comentários.'
  } finally {
    loading.value = false
  }
}

async function submitComment() {
  const trimmedContent = content.value.trim()
  formError.value = ''
  if (!trimmedContent) {
    formError.value = 'Escreva um comentário antes de publicar.'
    return
  }
  if (trimmedContent.length > 500) {
    formError.value = 'O comentário deve ter no máximo 500 caracteres.'
    return
  }

  isSubmitting.value = true
  try {
    const response = await createComment(props.recipeId, trimmedContent)
    comments.value.unshift(response.data)
    content.value = ''
    emit('count-change', comments.value.length)
  } catch (requestError) {
    formError.value = requestError.message || 'Não foi possível publicar o comentário.'
  } finally {
    isSubmitting.value = false
  }
}

onMounted(loadComments)
watch(() => props.recipeId, loadComments)
</script>
