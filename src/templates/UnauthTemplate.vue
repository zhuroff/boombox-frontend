<template>
  <div class="login">
    <main class="main --unauth">
      <Form
        :formSchema="formSchema"
        submitButtonLocale="signIn"
        @formSubmit="login"
      />
    </main>
  </div>
</template>

<script setup lang="ts">
import type { FormPayload, FormSchemaProperty } from '~widgets/Form/model/types'
import { Form } from '~widgets/Form'
import api from '../api'
import useGlobalStore from '~/store/global'

const {
  globalActions: { setAuthConfig }
} = useGlobalStore()

const formSchema = new Map<string, FormSchemaProperty>([
  ['email', {
    id: 'login-email',
    name: 'email',
    placeholder: 'loginForm.emailPlaceholder',
    required: true,
    type: 'email',
    label: {
      labelText: 'loginForm.email'
    }
  }],
  ['password', {
    id: 'login-password',
    name: 'password',
    placeholder: 'loginForm.passwordPlaceholder',
    required: true,
    type: 'password',
    label: {
      labelText: 'loginForm.password'
    }
  }]
])

const login = async (formData: FormPayload) => {
  try {
    const { data } = await api.post<AuthResponse>('api/users/login', formData)
    setAuthConfig('isAuthenticated', true)
    setAuthConfig('user', data.user)
    localStorage.setItem('token', data.accessToken)
  } catch (error) {
    console.error(error)
    setAuthConfig('isAuthenticated', false)
  }
}
</script>

<style lang="scss" scoped>
.login {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.main {

  &.--unauth {
    padding: 25px;
    width: 100%;
    max-width: 500px;
    height: auto;

    .form {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
  }
}
</style>
