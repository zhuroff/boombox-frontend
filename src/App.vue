<template>
  <component :is="layout">
    <router-view />
  </component>
</template>

<script lang="ts">

import { defineComponent, onMounted, computed } from 'vue'
import { useAuth } from './hooks/useAuth'
import api from './api'
import MainTemplate from '~/templates/MainTemplate.vue'
import UnauthTemplate from '~/templates/UnauthTemplate.vue'

export default defineComponent({
  components: {
    MainTemplate,
    UnauthTemplate
  },

  setup() {
    const { isAuthenticated, setIsAuthenticated } = useAuth()
    const layout = computed(() => (
      isAuthenticated.value ? 'MainTemplate' : 'MainTemplate' // 'UnauthTemplate'
    ))
    const syncMessage = localStorage.getItem('syncMessage')

    if (syncMessage) {
      localStorage.removeItem('syncMessage')
    }

    const checkAuthentication = async () => {
      if (!localStorage.getItem('token')) {
        return setIsAuthenticated(false)
      }
      try {
        const res = await api.get('users/refresh')
        console.log(res)
      } catch (error) {
        console.error(error)
      }
    }

    onMounted(checkAuthentication)

    return {
      layout
    }
  }
})

</script>

<style lang="scss">
@import '~/scss/app.scss';
</style>
