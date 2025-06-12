<template>
  <div class="settings__actions">
    <Button
      label="settings.createUser"
      @click="showUserForm"
    />
    <Button
      label="settings.showUsers"
      @click="handleGetUsers"
    />
    <BackupActions
      action="create"
      @onEmit="(data) => emit('passBackups', data)"
    />
    <BackupActions
      action="get"
      @onEmit="(data) => emit('passBackups', data)"
    />
    <SyncAction
      @passSyncData="(data) => emit('passSyncData', data)"
    />
    <Button
      label="settings.logout"
      @click="logout"
    />
    <LanguageSwitcher />
  </div>
</template>

<script setup lang="ts">
import { Button } from '~shared/UI'
import { SyncAction } from '~features/sync'
import { BackupActions } from '~features/backup'
import { useUserApi, UserService } from '~entities/user'
import { DatabaseService } from '~shared/api'
import { LanguageSwitcher } from '~features/localization'

interface Emits {
  <T>(e: 'passBackups', data: T): void
  <T>(e: 'passUsers', data: T): void
  <T>(e: 'passSyncData', data: T): void
}

const emit = defineEmits<Emits>()

const dbService = new DatabaseService()
const userService = new UserService()

const { logout, createUser, getUsers, users } = useUserApi(userService, dbService)

const handleGetUsers = async () => {
  await getUsers()
  emit('passUsers', users.value)
}

const showUserForm = () => {
  console.log('showUserForm')
}
</script>

<style lang="scss" scoped>
@use '~/app/styles/variables' as var;

.settings__actions {
  margin-bottom: var.$mainPadding;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  grid-area: actions;
}
</style>
