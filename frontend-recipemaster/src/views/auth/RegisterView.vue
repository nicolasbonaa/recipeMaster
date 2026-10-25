<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { register } from '../../services/authService'
import BaseButton from '../../components/base/BaseButton.vue'
import BaseInput from '../../components/base/BaseInput.vue'
import FormCard from '../../components/base/FormCard.vue'

const router = useRouter()

const form = reactive({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    fullName: ''
})

const errors = reactive({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    fullName: ''
})

const isSubmitting = ref(false)
const apiErrorMessage = ref('')

function validate() {
    Object.keys(errors).forEach((key) => {
        errors[key] = ''
    })

    if (!form.fullName.trim()) {
        errors.fullName = 'O nome completo é obrigatório.'
    }

    if (
        form.username.trim().length < 3 ||
        form.username.trim().length > 20
    ) {
        errors.username =
            'O nome de usuário deve ter entre 3 e 20 caracteres.'
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (!emailPattern.test(form.email)) {
        errors.email = 'Informe um e-mail válido.'
    }

    if (form.password.length < 6) {
        errors.password =
            'A senha deve ter pelo menos 6 caracteres.'
    }

    if (form.confirmPassword !== form.password) {
        errors.confirmPassword =
            'As senhas não coincidem.'
    }

    return Object.values(errors).every(
        (message) => message === ''
    )
}

async function handleSubmit() {
    apiErrorMessage.value = ''

    if (!validate()) {
        return
    }

    isSubmitting.value = true

    try {
        const response = await register({
            username: form.username.trim(),
            email: form.email.trim(),
            password: form.password,
            confirmPassword: form.confirmPassword,
            fullName: form.fullName.trim()
        })

        console.log('Conta criada:', response.data)

        router.push({ name: 'login' })
    } catch (error) {
        apiErrorMessage.value =
            error.response?.data?.message ||
            error.message ||
            'Não foi possível criar a conta.'
    } finally {
        isSubmitting.value = false
    }
}
</script>

<template>
    <div class="auth-page d-flex align-items-center py-5">
        <div class="container">
            <div class="row justify-content-center">
                <div class="col-12 col-md-8 col-lg-6">
                    <FormCard title="Criar conta" subtitle="Faça parte da comunidade Recipe Master.">
                        <div v-if="apiErrorMessage" class="alert alert-danger" role="alert">{{ apiErrorMessage }}</div>
                        <form @submit.prevent="handleSubmit">
                            <BaseInput id="fullName" v-model="form.fullName" label="Nome completo" :error="errors.fullName" required autocomplete="name" />
                            <BaseInput id="username" v-model="form.username" label="Usuário" :error="errors.username" required autocomplete="username" />
                            <BaseInput id="email" v-model="form.email" label="E-mail" type="email" :error="errors.email" required autocomplete="email" />
                            <BaseInput id="password" v-model="form.password" label="Senha" type="password" :error="errors.password" required autocomplete="new-password" />
                            <BaseInput id="confirmPassword" v-model="form.confirmPassword" label="Confirmar senha" type="password" :error="errors.confirmPassword" required autocomplete="new-password" />
                            <BaseButton type="submit" class="w-100 mt-2" :disabled="isSubmitting">
                                {{ isSubmitting ? 'Criando conta...' : 'Criar minha conta' }}
                            </BaseButton>
                        </form>
                        <p class="text-center text-body-secondary mt-4 mb-0">Já tem uma conta? <router-link to="/login">Entrar</router-link></p>
                    </FormCard>
                </div>
            </div>
        </div>
    </div>
</template>
