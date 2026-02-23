<template>
  <div class="login">
    <main class="main --unauth">
      <AuthForm :on-submit="handleLogin">
        <template #submit="{ canSubmit, isSubmitting }">
          <Button
            type="submit"
            :label="localize('signIn')"
            :disabled="!canSubmit || isSubmitting || isLoggingIn"
          />
        </template>
      </AuthForm>
    </main>
  </div>
</template>

<script setup lang="ts">
import { Button } from '~shared/UI'
import { DatabaseService } from '~shared/api'
import { useLocalization } from '~shared/model'
import { useUserApi, UserService } from '~entities/user'
import { AuthForm } from '~features/authorization'
import type { FormPayload } from '~shared/lib'

const dbService = new DatabaseService()
const userService = new UserService()

const { localize } = useLocalization()

const { login, isLoggingIn } = useUserApi(userService, dbService)

const handleLogin = async (formData: FormPayload) => {
  try {
    await login(formData)
  } catch (error) {
    console.error(error)
  }
}
</script>

<style lang="scss" scoped>
@use '~/app/styles/variables' as var;

.login {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.main {
  &.--unauth {
    padding: var.$mainPadding;
    width: 100%;
    max-width: 500px;
    height: auto;
    background-color: var.$light;

    @include var.media('<desktop') {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    }

    .form {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      width: 100%;
    }
  }
}
</style>
