<template>
  <SettingsActions @passBackups="setBackups" />

  <section
    v-if="backupsTableState.rows.length"  
    class="settings__section"
  >
    <h2 class="settings__section-heading">
      {{ localize('headings.backups') }}
    </h2>

    <Table
      :tableState="backupsTableState"
      :localeRootKey="'backups'"
      @onEmit="setBackups"
    />
  </section>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { SettingsActions, backupsTableSchema } from '~features/settings'
import { useTranslate } from '~features/localization'
import { Table } from '~shared/UI'
import type { JSONSchema4, JSONSchema4Type } from 'json-schema'

const backupsTableState = reactive<TableConfig<Record<string, JSONSchema4Type>, JSONSchema4>>({
  rows: [],
  schema: backupsTableSchema
})

const { localize } = useTranslate()

const setBackups = (data: string[]) => {
  backupsTableState.rows = data.map((timestamp) => ({ timestamp }))
}
</script>

<style lang="scss" scoped>
@use '~/scss/variables' as var;

.settings__section {
  grid-area: backups;

  &-heading {
    @include var.serif(1.75rem);
    margin-bottom: .5rem;
  }
}
</style>
