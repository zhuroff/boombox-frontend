<template>
  <div class="container">
    <main class="main">
      <form @submit.prevent="signIn">
        <fieldset>
          <legend>Sign in</legend>
          <input type="text" placeholder="login" v-model="userData.login" />
          <input type="password" placeholder="password" v-model="userData.password" />
        </fieldset>
        <button type="submit">Log in</button>
      </form>
      <form @submit.prevent="signUp">
        <fieldset>
          <legend>Sign up</legend>
          <input type="text" placeholder="login" v-model="registerData.login" />
          <input type="password" placeholder="password" v-model="registerData.password" />
          <input type="password" placeholder="password" v-model="registerData.passwordRepeat" />
        </fieldset>
        <button type="submit">Register</button>
      </form>
    </main>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive } from 'vue'

export default defineComponent({
  name: 'UnauthTemplate',
  setup() {
    const userData = reactive({
      login: '',
      password: ''
    })

    const registerData = reactive({
      login: '',
      password: '',
      passwordRepeat: '',
      role: 'admin'
    })

    const signIn = () => {
      console.log(userData)
    }

    const signUp = () => {
      console.log(registerData)
    }

    return {
      signIn,
      signUp,
      userData,
      registerData
    }
  }
})
</script>
