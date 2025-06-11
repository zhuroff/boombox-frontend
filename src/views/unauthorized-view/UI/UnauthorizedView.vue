<template>
  <div class="login">
    <main class="main --unauth">
      <Form
        :formSchema="formSchema"
        submitButtonLocale="signIn"
        :isLoading="isLoggingIn"
        @formSubmit="handleLogin"
      />
    </main>
  </div>
</template>

<script setup lang="ts">
import { Form } from '~shared/UI'
import { useUserApi } from '~entities/user'
import { DatabaseService } from '~shared/api'
import type { FormPayload, FormSchemaProperty } from '~shared/lib'

const dbService = new DatabaseService()
const { login, isLoggingIn } = useUserApi(dbService)

const formSchema = new Map<string, FormSchemaProperty>([
  ['email', {
    id: 'login-email',
    name: 'email',
    placeholder: 'loginForm.emailPlaceholder',
    required: true,
    type: 'email',
    label: {
      labelText: 'loginForm.email'
    },
    errorMessages: [],
    validator<T = string>(value: T) {
      if (!value) {
        this.errorMessages?.push('loginForm.emailRequired')
      }

      return this.errorMessages?.length || 0
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
    },
    errorMessages: [],
    validator<T = string>(value: T) {
      if (!value) {
        this.errorMessages?.push('loginForm.passwordRequired')
      }

      return this.errorMessages?.length || 0
    }
  }]
])

const handleLogin = async (formData: FormPayload) => {
  try {
    await login(formData)
  } catch (error) {
    console.error(error)
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
