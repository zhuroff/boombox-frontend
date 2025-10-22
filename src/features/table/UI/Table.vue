<template>
  <table class="table">
    <thead
      v-if="!isHeadless"
      class="table__head"
    >
      <TableHeadRow :cells="headerConfig" />
    </thead>

    <tbody class="table__body">
      <TableBodyRow
        v-for="row in rows"
        :key="row.id"
        :row="row"
        :schema="schema"
        :isActionable="isActionable"
        @tableRowClick="(row) => emit('tableRowClick', row)"
        @onEmit="onEmit"
      />
    </tbody>
  </table>
</template>

<script setup lang="ts">
import type { TableSchema, TableFilters, TableRow, TableHeaderConfig } from '~shared/lib'
import TableHeadRow from './TableHeadRow.vue'
import TableBodyRow from './TableBodyRow.vue'

type Props = {
  rows: TableRow[]
  schema: TableSchema,
  headerConfig: TableHeaderConfig[]
  filters?: TableFilters
  isHeadless?: boolean
  isActionable?: boolean
}

type Emits = {
  <T>(e: 'onEmit', payload: T): void
  (e: 'tableRowClick', payload: TableRow): void
}

withDefaults(defineProps<Props>(), {
  isHeadless: false,
  isActionable: false
})

const emit = defineEmits<Emits>()

const onEmit = <T,>(data: T): void => {
  emit('onEmit', data)
}
</script>

<style lang="scss">
.table {
  width: 100%;
}
</style>
