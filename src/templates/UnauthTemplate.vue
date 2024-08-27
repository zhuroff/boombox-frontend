<template>
  <div class="login">
    <main class="main --unauth">
      <Form
        :schema="formSchema"
        :isInverted="true"
        @formSubmit="login"
      />
    </main>
  </div>
</template>

<script setup lang="ts">
import { JSONSchema4 } from 'json-schema'
import api from '../api'
import useGlobalStore from '~/store/global'
import Form from '~/components/Form.vue'
import loginFormSchema from '~/schemas/loginFormSchema.json'

const {
  globalActions: { setAuthConfig }
} = useGlobalStore()

const formSchema = loginFormSchema as JSONSchema4

const login = async (formData: AuthData) => {
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
@import '~/scss/variables.scss';

.login {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: $black;
}

.main {

  &.--unauth {
    padding: 25px;
    width: 100%;
    max-width: 500px;

    .form {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
  }
}
</style>
