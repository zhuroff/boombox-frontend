<template>
  <td :class="cellClass">
    <span v-if="!filter?.length || !filtersState">{{ cell.heading }}</span>
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
import { computed } from 'vue'
import { Select } from '~shared/UI'

interface Props {
  cell: TableHeadConfig<JSONSchema4>
  localeRootKey: string
  filter?: string[]
  filtersState?: Record<string, string | number | null>
}

interface Emits {
  (e: 'updateFilterValue', value: [string, string | number | null]): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const cellClass = computed(() => {
  const classArray = ['table__head-cell']

  if (props.cell.schema?.props?.align) {
    classArray.push(`--${props.cell.schema.props.align}`)
  }

  return classArray
})
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

  &.--right {
    text-align: right;
  }

  &.--center {
    text-align: center;
  }
}
</style>
