<template>
  <section class="settings__section">
    <h2 class="settings__section-heading">
      {{ localize('headings.backups') }}
    </h2>

    <Table
      :rows="backupsTableState.rows"
      :schema="backupsTableState.schema"
      :headerConfig="tableHeaderConfig"
      @onEmit="(data: string[]) => emit('passBackups', data)"
    />
  </section>
</template>

<script setup lang="ts">
import { h, computed } from 'vue'
import { useLocalization } from '~shared/model'
import { Table } from '~features/table'
import type { BasicTableState, TableHeaderConfig } from '~shared/lib'

interface Props {
  backupsTableState: BasicTableState
}

interface Emits {
  (e: 'passBackups', data: string[]): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const { localize } = useLocalization()

const tableHeaderConfig = computed<TableHeaderConfig[]>(() => {
  const { order } = props.backupsTableState.schema

  return order.map((key) => {
    const heading = localize(`backupsTable.${key}`)

    return {
      key,
      element: h('span', {}, heading)
    }
  })
})
</script>

<style lang="scss" scoped>
@use '~app/styles/variables' as var;

.settings__section {
  grid-area: backups;

  &-heading {
    @include var.serif(1.75rem);
    margin-bottom: .5rem;
  }
}
</style>
