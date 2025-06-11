<template>
  <tr class="table__row">
    <TableHeadCell
      v-for="cell in cells"
      :key="cell.key"
      :cell="cell"
      :filter="filters?.[cell.key]"
      :filtersState="filtersState"
      :localeRootKey="localeRootKey"
      @updateFilterValue="(value) => emit('updateFilterValue', value)"
    />
  </tr>
</template>

<script setup lang="ts">
import type { JSONSchema4 } from 'json-schema'
import type { TableFilters, TableHeadConfig } from '~shared/lib'
import TableHeadCell from './TableHeadCell.vue'

interface Props {
  cells: TableHeadConfig<JSONSchema4>[]
  localeRootKey: string
  filters?: TableFilters
  filtersState?: Record<string, string | number | null>
}

interface Emits {
  (e: 'updateFilterValue', value: [string, string | number | null]): void
}

defineProps<Props>()
const emit = defineEmits<Emits>()
</script>
