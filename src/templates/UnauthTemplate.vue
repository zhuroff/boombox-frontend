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

<script lang="ts">
import { defineComponent } from 'vue'
import { JSONSchema4 } from 'json-schema'
import { AuthData } from '~/types/User'
import Form from '~/components/Form.vue'
import loginFormSchema from '~/schemas/loginFormSchema.json'

export default defineComponent({
  name: 'UnauthTemplate',
  components: {
    Form
  },
  setup() {
    const formSchema = loginFormSchema as JSONSchema4

    const login = (formData: AuthData) => {
      console.log(formData)
    }

    return {
      login,
      formSchema
    }
  }
})
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
