<template>
  <section class="content">
    <div class="settings">
      <SettingsActions
        @passBackups="setBackups"
        @passUsers="setUsers"
        @passSyncData="setSyncData"
      />
      <SettingsBackups
        v-if="backupsTableState.rows.length"
        :backupsTableState="backupsTableState"
        @passBackups="setBackups"
      />
      <SettingsUsers
        v-if="usersTableState.rows.length"
        :usersTableState="usersTableState"
        @passUsers="setUsers"
      />
    </div>
    <Modal
      :isModalActive="showSyncDataModal"
      @closeModal="handleCloseSyncDataModal"
    >
      <AlbumSyncList
        v-if="!!syncData"
        :sections="syncData"
      />
    </Modal>
  </section>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { SettingsActions, SettingsBackups, SettingsUsers } from '~widgets/settings'
import type { JSONSchema4, JSONSchema4Type } from 'json-schema'
import { backupsTableSchema } from '~features/backup'
import { usersTableSchema, type User } from '~entities/user'
import { AlbumSyncList, type SyncDataPayload } from '~features/sync'
import { Modal } from '~shared/UI'
import type { TableConfig, SyncResponse } from '~shared/lib'

const showSyncDataModal = ref(false)
const syncData = ref<SyncResponse | null>(null)
const syncDataReset = ref<() => void>(() => {})

const backupsTableState = reactive<TableConfig<Record<string, JSONSchema4Type>, JSONSchema4>>({
  rows: [],
  schema: backupsTableSchema
})

const usersTableState = reactive<TableConfig<Record<string, JSONSchema4Type>, JSONSchema4>>({
  rows: [],
  schema: usersTableSchema
})

const setBackups = (data: string[]) => {
  backupsTableState.rows = data.map((timestamp) => ({ timestamp }))
}

const setUsers = (data: User[]) => {
  usersTableState.rows = data.map((user) => ({
    id: user._id,
    email: user.email,
    role: user.role
  }))
}

const setSyncData = (payload: SyncDataPayload) => {
  syncData.value = payload.data
  syncDataReset.value = payload.reset
  showSyncDataModal.value = true
}

const handleCloseSyncDataModal = () => {
  showSyncDataModal.value = false
  syncDataReset.value?.()
}
</script>

<style lang="scss" scoped>
@use '~/app/styles/variables' as var;

.settings {
  padding: 0 var.$basicPadding;
  display: grid;
  grid-template-columns: var.$coverWidth 1fr;
  grid-template-areas: 
    'actions users'
    'actions backups';
  gap: var.$mainPadding;
}
</style>
