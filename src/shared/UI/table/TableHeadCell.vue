<template>
  <td class="table__head-cell">
    <span v-if="!filter?.length">{{ cell.heading }}</span>
    <Select
      v-else
      size="small"
      :options="filter"
      :localeKey="localeRootKey"
      :entityKey="cell.key"
      :selected="filtersState"
      :style="{ maxWidth: '120px' }"
      @update:select="(value) => emit('updateFilterValue', value)"
    />
  </td>
</template>

<script setup lang="ts">
import type { JSONSchema4 } from 'json-schema'
import { Select } from '~shared/UI'

interface Props {
  cell: TableHeadConfig<JSONSchema4>
  filter?: string[]
  filtersState: Record<string, string | number | null>
  localeRootKey: string
}

interface Emits {
  (e: 'updateFilterValue', value: [string, string | number | null]): void
}

defineProps<Props>()
const emit = defineEmits<Emits>()
</script>

<style lang="scss" scoped>
@use '~/scss/variables' as var;

.table__head-cell {
  font-weight: 600;
  padding: 0.25rem;
  vertical-align: middle;

  span {
    font-size: 0.875rem;
  }
}
</style>
