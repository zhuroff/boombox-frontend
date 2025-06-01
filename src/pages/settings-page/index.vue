<template>
  <section class="content">
    <div class="settings">
      <SettingsActions
        @passBackups="setBackups"
        @passUsers="setUsers"
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
      
      <!-- <section
        v-if="isAdmin"
        class="settings__section"
      >
        <h2 class="settings__section-heading">{{ localize('headings.createUser') }}</h2>
        <div class="settings__form">
          <Form
            :schema="userSchema"
            :isResetAfterSubmit="true"
            :style="{ gap: '0.5rem', display: 'flex', flexDirection: 'column', maxWidth: '50%' }"
            @formSubmit="createUser"
          />
        </div>
      </section> -->
    </div>
  </section>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { SettingsActions } from '~features/settings'
import { SettingsBackups, SettingsUsers } from '~widgets/settings'
import type { JSONSchema4, JSONSchema4Type } from 'json-schema'
import { backupsTableSchema } from '~features/backup'
import { usersTableSchema, type User } from '~entities/user'

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
</script>

<style lang="scss" scoped>
@use '~/scss/variables' as var;

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
