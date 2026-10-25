<template>
  <div v-if="isLoginPage" class="auth-layout">
    <router-view />
  </div>

  <div v-else class="app-layout">
    <TheNavbar />
    
      <div class="app-body">
        <TheSidebar />
        <main class="app-content">
          <router-view />
        </main>
      </div>
    <TheFooter />
  </div>
</template>

<script setup>
  import { computed } from 'vue'
  import { useRoute } from 'vue-router'
  import TheNavbar from './components/layout/TheNavbar.vue'
  import TheSidebar from './components/layout/TheSidebar.vue'
  import TheFooter from './components/layout/TheFooter.vue'

  const route = useRoute()
  const isLoginPage = computed(() => route.name === 'login')
</script>
