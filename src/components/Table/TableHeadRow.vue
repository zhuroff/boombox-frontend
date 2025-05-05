<template>
  <tr class="table__row">
    <TableHeadCell
      v-for="cell in cells"
      :key="cell.key"
      :cell="cell"
      :filter="filters[cell.key]"
      :filtersState="filtersState"
      :localeRootKey="localeRootKey"
      @updateFilterValue="(value) => emit('updateFilterValue', value)"
    />
  </tr>
</template>

<script setup lang="ts">
import type { JSONSchema4 } from 'json-schema'
import TableHeadCell from './TableHeadCell.vue'

interface Props {
  cells: TableHeadConfig<JSONSchema4>[]
  filters: TableFilters
  localeRootKey: string
  filtersState: Record<string, string | null>
}

interface Emits {
  (e: 'updateFilterValue', value: [string, string | null]): void
}

defineProps<Props>()
const emit = defineEmits<Emits>()
</script>

<style lang="scss" scoped>
@use '~/scss/variables' as var;
</style>
