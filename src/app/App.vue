<template>
  <Loader v-if="isRefreshing" mode="light" />
  <Authorized v-else-if="isAuthorized" />
  <Unauthorized v-else />
</template>

<script setup lang="ts">
import { onBeforeMount } from 'vue'
import { Loader } from '~shared/UI'
import { useTranslate } from '~features/localization'
import { useUserApi, useUser } from '~entities/user'
import { DatabaseService } from '~shared/api'
import Authorized from './providers/Authorized.vue'
import Unauthorized from './providers/Unauthorized.vue'

const { checkAndSetLocale } = useTranslate()

const dbService = new DatabaseService()
const { checkAuthorization, isRefreshing } = useUserApi(dbService)
const { isAuthorized } = useUser()

onBeforeMount(() => {
  checkAndSetLocale()
  checkAuthorization()
})
</script>
