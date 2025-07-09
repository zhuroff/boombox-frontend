<template>
  <div class="login">
    <main class="main --unauth">
      <Form
        :formSchema="formSchema"
        :isLoading="isLoggingIn"
        @formSubmit="handleLogin"
      >
        <template #submit>
          <Button
            type="submit"
            :label="localize('signIn')"
          />
        </template>
      </Form>
    </main>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { Form, Button } from '~shared/UI'
import { DatabaseService } from '~shared/api'
import { useLocalization } from '~shared/model'
import { useUserApi, UserService } from '~entities/user'
import { authFormSchema } from '~features/authorization'
import type { FormPayload } from '~shared/lib'

const dbService = new DatabaseService()
const userService = new UserService()

const { localize } = useLocalization()

const formSchema = reactive(authFormSchema(localize))

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
