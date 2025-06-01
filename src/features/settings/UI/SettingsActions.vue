<template>
  <div class="settings__actions">
    <Button
      label="settings.createUser"
      @click="showUserForm"
    />
    <Button
      label="settings.showUsers"
      @click="showUsers"
    />
    <BackupActions
      action="create"
      @onEmit="(data) => emit('passBackups', data)"
    />
    <BackupActions
      action="get"
      @onEmit="(data) => emit('passBackups', data)"
    />
    <SyncAction />
    <Button
      label="settings.logout"
      @click="logout"
    />
    <LanguageSwitcher />
  </div>
</template>

<script setup lang="ts">
import { Button } from '~shared/UI'
import { SyncAction, BackupActions } from '~features/settings'
import { useUserApi } from '~entities/user'
import { DatabaseService } from '~shared/api'
import { LanguageSwitcher } from '~features/localization'

interface Emits {
  (e: 'passBackups', data: any): void
}

const emit = defineEmits<Emits>()

const dbService = new DatabaseService()

const { logout, createUser } = useUserApi(dbService)



const showUserForm = () => {
  console.log('showUserForm')
}

const showUsers = () => {
  console.log('showUsers')
}
</script>

<style lang="scss" scoped>
@use '~/scss/variables' as var;

.settings__actions {
  margin-bottom: var.$mainPadding;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  grid-area: actions;
}
</style>
