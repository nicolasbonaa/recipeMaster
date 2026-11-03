/*

Explicação dos 3 Ramos:

1) a parte de sucesso, quando o interceptador do axios consulta a URL posta dentro do .env ele cai dentro primeiro parametro da função response, 
e se em caso de não erro ele passa toda a resposta enviada.

2) No caso de erro é feito um if para entender se o erro está na requisição ou se está na resposta. No caso de cair na resposta, significa que a API está respondendo
para a nossa aplicação, porém algo está errado pois estamos recebendo erro 4.. ou 5..

3) No caso do erro cair dentro da requisição, como o professor disse é algo mais raro, porém pode acontecer no caso da conexão com a API não ter sido feita de maneira correta.

*/

import axios from "axios";
import router from '../router/index.js'
import { useAuthStore } from '../stores/auth.js'
import { useToast } from '../composables/useToast.js'
import { MESSAGES } from '../config/constants.js'
import { STORAGE_KEYS } from '../config/constants.js'

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
})

api.interceptors.response.use(
    (response) => response.data,
    (error) => {
        const requestConfig = error.config || {}
        if (error.response?.status === 401) {
            useAuthStore().logout()
            if (router.currentRoute.value.name !== 'login') {
                router.push({ name: 'login' })
            }
        }

        if (error.response) {
            const apiError = error.response.data
            if (!requestConfig.silent && requestConfig.method !== 'get') {
                useToast().addToast(apiError.message || MESSAGES.ACTION_ERROR)
            }
            return Promise.reject({
                message: apiError.message || 'Erro desconhecido',
                errors: apiError.errors || [],
                status: error.response.status
            })
        }else {
            if (!requestConfig.silent && requestConfig.method !== 'get') {
                useToast().addToast(MESSAGES.NETWORK_ERROR)
            }
            return Promise.reject({
                message: MESSAGES.NETWORK_ERROR,
                errors: [],
                status: null
            })
        }
    }
)

api.interceptors.request.use((config) => {
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN)

    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }

    return config
})

export default api;
