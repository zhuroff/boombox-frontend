<template>
  <component :is="layout">
    <router-view />
  </component>
</template>

<script lang="ts">

import { defineComponent, onMounted, computed } from 'vue'
import { useLocales } from '~/hooks/useLocales'
import MainTemplate from '~/templates/MainTemplate.vue'
import UnauthTemplate from '~/templates/UnauthTemplate.vue'
import api from './api'
import store from './store'

export default defineComponent({
  components: {
    MainTemplate,
    UnauthTemplate
  },

  setup() {
    const { checkAndSetLocale } = useLocales()
    const { getters, actions } = store
    const layout = computed(() => (
      getters.authConfig.value.isAuthenticated ? 'MainTemplate' : 'UnauthTemplate'
    ))
    const syncMessage = localStorage.getItem('syncMessage')

    if (syncMessage) {
      localStorage.removeItem('syncMessage')
    }

    const checkAuthentication = async () => {
      if (!localStorage.getItem('token')) {
        try {
          const { data }  = await api.get('api/users/refresh')

          localStorage.setItem('token', data.accessToken)
          actions.setAuthConfig('isAuthenticated', true)
          actions.setAuthConfig('user', data.user)
        } catch (error) {
          console.error(error)
          localStorage.removeItem('token')
        }
      } else {
        actions.setAuthConfig('isAuthenticated', true)
      }
    }

    onMounted(() => {
      checkAndSetLocale()
      checkAuthentication()
    })

    return { layout }
  }
})

</script>

<style lang="scss">
@import '~/scss/app.scss';

.template {
  padding-bottom: 25px;
}
</style>
