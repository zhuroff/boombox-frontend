<template>
  <Loader v-if="isRefreshing" mode="light" />
  <AuthorizedView v-else-if="isAuthorized" />
  <UnauthorizedView v-else />
</template>

<script setup lang="ts">
import { onBeforeMount } from 'vue'

import { AuthorizedView } from '~views/authorized-view'
import { UnauthorizedView } from '~views/unauthorized-view'

import { useUserApi, useUser } from '~entities/user'

import { Loader } from '~shared/UI'
import { DatabaseService } from '~shared/api'
import { useLocalization } from '~shared/lib'

const { checkAndSetLocale } = useLocalization()

const dbService = new DatabaseService()
const { checkAuthorization, isRefreshing } = useUserApi(dbService)
const { isAuthorized } = useUser()

onBeforeMount(() => {
  checkAndSetLocale()
  checkAuthorization()
})
</script>
