<script setup>
import { ref, onMounted } from 'vue'
import { getApiStatus } from '../services/systemService'

const apiStatus = ref('carregando...')

onMounted(async () => { 
    try {
        const response = await getApiStatus()
        apiStatus.value = response.data.status
    }catch (error){
        apiStatus.value = 'offline'
        console.error('Erro ao buscar status da API: ', error)
    }
})

import { search } from '../services/serachService'

search('a')
        .then((response) => {
        console.log('Busca OK:', response.data)
    })
    .catch((error) => {
    console.error('Erro na busca:', error.message)
})

</script>

<template>
    <div class="landing">
        <h1>Bem-vindo ao Recipe Master</h1>
        <p>Status da API: <strong>{{ apiStatus }}</strong></p>
    </div>
</template>