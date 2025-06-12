<template>
  <section class="settings__section">
    <h2 class="settings__section-heading">
      {{ localize('headings.backups') }}
    </h2>

    <Table
      :localize="localize"
      :tableState="backupsTableState"
      :localeRootKey="'backups'"
      @onEmit="(data) => emit('passBackups', data)"
    />
  </section>
</template>

<script setup lang="ts">
import { useLocalization } from '~shared/model'
import { Table } from '~shared/UI'
import type { JSONSchema4, JSONSchema4Type } from 'json-schema'
import type { TableConfig } from '~shared/lib'

interface Props {
  backupsTableState: TableConfig<Record<string, JSONSchema4Type>, JSONSchema4>
}

interface Emits {
  (e: 'passBackups', data: string[]): void
}

defineProps<Props>()
const emit = defineEmits<Emits>()

const { localize } = useLocalization()
</script>

<style lang="scss" scoped>
@use '~/app/styles/variables' as var;

.settings__section {
  grid-area: backups;

  &-heading {
    @include var.serif(1.75rem);
    margin-bottom: .5rem;
  }
}
</style>
