<template>
  <article class="recipe-card">
    <button class="recipe-card__action" type="button" :aria-label="`Abrir receita ${recipe.title}`" @click="$emit('select', recipe)">
      <img class="recipe-card__image" :src="getRecipeImageUrl(recipe.image)" :alt="recipe.title" />
      <div class="recipe-card__body">
        <h2>{{ recipe.title }}</h2>
        <p>{{ recipe.description }}</p>
      </div>
    </button>
    <div class="recipe-card__footer">
      <router-link v-if="showAuthor && recipe.author?.username" class="recipe-card__author" :to="{ name: 'public-profile', params: { id: recipe.author.username } }" @click.stop>
        {{ recipe.author.fullName || recipe.author.username }}
      </router-link>
      <span>{{ recipe.views || 0 }} visualizações</span>
      <span>{{ formatCount(recipe.likesCount) }} curtidas</span>
      <span>{{ formatCount(recipe.commentsCount) }} comentários</span>
      <div v-if="$slots.actions" class="recipe-card__actions"><slot name="actions" /></div>
    </div>
  </article>
</template>

<script setup>
import { getRecipeImageUrl } from '../utils/media.js'
import { formatCount } from '../utils/format.js'

defineProps({
  recipe: {
    type: Object,
    required: true,
  },
  showAuthor: { type: Boolean, default: true },
})

defineEmits(['select'])
</script>