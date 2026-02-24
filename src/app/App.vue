<template>
  <Loader v-if="isRefreshing" :mode="isMobile ? 'dark' : 'light'" />
  <AuthorizedView v-else-if="isAuthorized" />
  <UnauthorizedView v-else />
</template>

<script setup lang="ts">
import { onBeforeMount } from 'vue'

import { AuthorizedView } from '~views/authorized-view'
import { UnauthorizedView } from '~views/unauthorized-view'

import { useUserApi, UserService } from '~entities/user'

import { Loader } from '~shared/UI'
import { DatabaseService } from '~shared/api'
import { useLocalization, useUser, useDevice } from '~shared/model'

const { checkAndSetLocale } = useLocalization()

const dbService = new DatabaseService()
const userService = new UserService()

const { checkAuthorization, isRefreshing } = useUserApi(userService, dbService)
const { isAuthorized } = useUser()
const { isMobile } = useDevice()

onBeforeMount(() => {
  checkAndSetLocale()
  checkAuthorization()
})
</script>
