<script setup>
import { ref, onMounted } from 'vue'

const apiStatus = ref('carregando...')

onMounted(async () => { 
    try {

        const response = await fetch(import.meta.env.VITE_API_URL, {
        method: 'GET',
        headers: {
                'Cache-Control': 'no-cache', 
                'Pragma': 'no-cache' 
            }
        })
        const json = await response.json()
        apiStatus.value = json.data.status
    }catch (error){
        apiStatus.value = 'offline'
        console.error('Erro ao buscar status da API: ', error)
    }
})
</script>

<template>
    <div class="landing">
        <h1>Bem-vindo ao Recipe Master</h1>
        <p>Status da API: <strong>{{ apiStatus }}</strong></p>
    </div>
</template>