<template>
  <div
    v-if="isAuthChecking"
    class="app-preloading"
  >
    <Preloader mode="light" />
  </div>
  <component
    v-else
    :is="layout"
  >
    <router-view />
  </component>
</template>

<script lang="ts">
import { defineComponent, onMounted, computed } from 'vue'
import { useLocales } from '~/hooks/useLocales'
import Preloader from '~/components/Preloader.vue'
import MainTemplate from '~/templates/MainTemplate.vue'
import UnauthTemplate from '~/templates/UnauthTemplate.vue'
import api from './api'
import store from './store'

export default defineComponent({
  components: {
    Preloader,
    MainTemplate,
    UnauthTemplate
  },

  setup() {
    const { checkAndSetLocale } = useLocales()
    const { getters: { authConfig }, actions } = store

    const isAuthChecking = computed(() => (
      typeof authConfig.value.isAuthenticated === 'undefined'
    ))

    const layout = computed(() => (
      authConfig.value.isAuthenticated ? 'MainTemplate' : 'UnauthTemplate'
    ))

    const syncMessage = localStorage.getItem('syncMessage')

    if (syncMessage) {
      localStorage.removeItem('syncMessage')
    }

    const checkAuthentication = async () => {
      try {
        const { data }  = await api.get('api/users/refresh')

        localStorage.setItem('token', data.accessToken)
        actions.setAuthConfig('isAuthenticated', true)
        actions.setAuthConfig('user', data.user)
      } catch (error) {
        console.error(error)
        localStorage.removeItem('token')
        actions.setAuthConfig('isAuthenticated', false)
        actions.setAuthConfig('user', undefined)
      }
    }

    onMounted(() => {
      checkAndSetLocale()
      checkAuthentication()
    })

    return { isAuthChecking, layout }
  }
})
</script>

<style lang="scss">
@import '~/scss/app.scss';
@import '~/scss/variables';

.template {
  padding-bottom: 25px;
}

.app-preloading {
  background-color: $white;
  position: absolute;
  z-index: 9000;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
