<template>
  <section class="feed-page">
    <!--
      Alcançabilidade (Atividade 13):
      - Minhas Coleções: item "Minhas Coleções" no menu do avatar (Navbar) e item "Minhas coleções" na Sidebar.
      - Criar / excluir: botões nesta tela (modal de criação / modal de confirmação).
      - Detalhe da coleção: clique no cartão desta lista.
      - Salvar uma receita: botão "Salvar" no detalhe da receita (visitante -> login -> volta à receita).
      - Remover receita da coleção: botão em cada card do detalhe (só para a dona).
      - Busca: barra da Navbar (Enter) e item "Explorar" da Sidebar.
      Lacuna conhecida: a coleção pública de outra pessoa só é alcançável por link.
    -->
    <header class="feed-header">
      <div>
        <p class="eyebrow">Organização</p>
        <h1>Minhas coleções</h1>
        <p class="feed-intro">Salve receitas para encontrar depois.</p>
      </div>
      <button class="btn btn-brand" type="button" @click="isCreating = true"><i class="bi bi-plus-lg me-1"></i>Nova coleção</button>
    </header>

    <div v-if="loading" class="feed-state">Carregando coleções...</div>
    <div v-else-if="error" class="alert alert-danger">{{ error }}</div>
    <div v-else-if="!collections.length" class="feed-state">
      Você ainda não tem coleções. Clique em <strong>Nova coleção</strong> para criar a primeira e depois use o botão
      <strong>Salvar</strong> no detalhe de uma receita.
    </div>
    <div v-else class="collection-grid">
      <article v-for="collection in collections" :key="collection.id" class="collection-card position-relative">
        <div class="d-flex align-items-start justify-content-between gap-2">
          <h2 class="h5 mb-1">
            <router-link class="stretched-link text-decoration-none collection-card__link" :to="{ name: 'collection-detail', params: { id: collection.id } }">
              {{ collection.title }}
            </router-link>
          </h2>
          <span class="badge" :class="collection.isPublic ? 'text-bg-success' : 'text-bg-secondary'">
            <i class="bi me-1" :class="collection.isPublic ? 'bi-globe' : 'bi-lock-fill'"></i>{{ collection.isPublic ? 'Pública' : 'Privada' }}
          </span>
        </div>
        <p class="text-secondary small mb-2">{{ collection.description || 'Sem descrição.' }}</p>
        <div class="d-flex align-items-center justify-content-between">
          <span class="small">{{ collection.recipesCount }} {{ collection.recipesCount === 1 ? 'receita' : 'receitas' }}</span>
          <button class="btn btn-sm btn-outline-danger position-relative z-2" type="button" @click="collectionToDelete = collection">Excluir</button>
        </div>
      </article>
    </div>

    <CreateCollectionModal :open="isCreating" @close="isCreating = false" @created="handleCreated" />

    <BaseModal :open="Boolean(collectionToDelete)" title="Excluir coleção" title-id="delete-collection-title" @close="closeDelete">
      <p>Excluir <strong>{{ collectionToDelete?.title }}</strong>? As receitas continuam existindo; só a coleção some.</p>
      <div class="d-flex justify-content-end gap-2">
        <button class="btn btn-outline-secondary" type="button" :disabled="deleting" @click="closeDelete">Cancelar</button>
        <button class="btn btn-danger" type="button" :disabled="deleting" @click="confirmDelete">{{ deleting ? 'Excluindo...' : 'Excluir' }}</button>
      </div>
    </BaseModal>
  </section>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import BaseModal from '../components/base/BaseModal.vue'
import CreateCollectionModal from '../components/CreateCollectionModal.vue'
import { deleteCollection, getMyCollections } from '../services/collectionService.js'
import { useAsyncData } from '../composables/useAsyncData.js'
import { useToast } from '../composables/useToast.js'
import { TOAST } from '../config/constants.js'

const collections = ref([])
const isCreating = ref(false)
const collectionToDelete = ref(null)
const deleting = ref(false)
const { addToast } = useToast()
const { loading, error, execute } = useAsyncData(getMyCollections)

async function load() {
  try { collections.value = (await execute()).data || [] } catch { collections.value = [] }
}

function handleCreated(collection) {
  collections.value = [collection, ...collections.value] // array novo, a nova no topo
  isCreating.value = false
  addToast('Coleção criada com sucesso.', 'success', TOAST.SUCCESS_DURATION)
}

function closeDelete() {
  if (!deleting.value) collectionToDelete.value = null
}

async function confirmDelete() {
  const target = collectionToDelete.value
  deleting.value = true
  try {
    await deleteCollection(target.id) // pessimista: só some depois da API confirmar
    collections.value = collections.value.filter((item) => item.id !== target.id)
    collectionToDelete.value = null
    addToast('Coleção excluída com sucesso.', 'success', TOAST.SUCCESS_DURATION)
  } catch {
    // O interceptor já mostrou o toast de erro; o modal continua aberto.
  } finally {
    deleting.value = false
  }
}

onMounted(load)
</script>

<style scoped>
.collection-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 1rem; }
.collection-card { padding: 1.1rem; background: #fff; border: 1px solid #eaded8; border-radius: 8px; transition: box-shadow .2s ease, transform .2s ease; }
.collection-card:hover { transform: translateY(-2px); box-shadow: 0 10px 24px rgba(77, 48, 38, .1); }
.collection-card__link { color: #332c29; }
</style>
