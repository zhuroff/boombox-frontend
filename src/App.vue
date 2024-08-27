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

<script setup lang="ts">
import { onMounted, computed } from 'vue'
import api from '~/api'
import useGlobalStore from '~/store/global'
import Preloader from '~/components/Preloader.vue'
import MainTemplate from '~/templates/MainTemplate.vue'
import UnauthTemplate from '~/templates/UnauthTemplate.vue'

const {
  globalActions: { checkAndSetLocale, setAuthConfig },
  globalGetters: { isAuthenticated }
} = useGlobalStore()

const isAuthChecking = computed(() => (
  typeof isAuthenticated.value === 'undefined'
))

const layout = computed(() => (
  isAuthenticated.value ? MainTemplate : UnauthTemplate
))

const syncMessage = localStorage.getItem('syncMessage')

if (syncMessage) {
  localStorage.removeItem('syncMessage')
}

const checkAuthentication = async () => {
  try {
    const { data } = await api.get<AuthRefreshResponse>('api/users/refresh')

    localStorage.setItem('token', data.accessToken)
    setAuthConfig('isAuthenticated', true)
    setAuthConfig('user', data.user)
  } catch (error) {
    console.error(error)
    localStorage.removeItem('token')
    setAuthConfig('isAuthenticated', false)
    setAuthConfig('user', undefined)
  }
}

onMounted(() => {
  checkAndSetLocale()
  checkAuthentication()
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
