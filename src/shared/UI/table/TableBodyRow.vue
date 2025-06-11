<template>
  <tr
    class="table__row"
    :style="{ cursor: rowLink.href ? 'pointer' : 'default' }"
    @click="rowClickHandler"
  >
    <TableBodyCell
      v-for="cell in rowCells"
      :key="cell.key"
      :cell="cell"
      :row="row"
      @onEmit="<T>(payload: T) => emit('onEmit', payload)"
    />
  </tr>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { JSONSchema4, JSONSchema4Type, JSONSchema4TypeName } from 'json-schema'
import type { TableCellConfig } from '~shared/lib'
import TableBodyCell from './TableBodyCell.vue'

interface Props {
  row: Record<string, JSONSchema4Type>
  schema: JSONSchema4
}

interface Emits {
  <T>(e: 'onEmit', data: T): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const rowCells = computed<TableCellConfig<JSONSchema4TypeName, JSONSchema4>[]>(() => (
  props.schema.order.map((key: string) => ({
    key,
    value: props.row[key],
    schema: props.schema.properties?.[key]
  }))
))

const rowLink = computed(() => {
  const [key, schema] = Object.entries(props.schema.properties || {})
    .find(([_, { isRowLink }]) => !!isRowLink) || []

  return {
    href: key && props.row[key],
    schema
  }
})

const rowClickHandler = () => {
  if (!rowLink.value.href) return

  rowLink.value.schema?.isInnerPage
    ? window.location.href = String(rowLink.value.href)
    : window.open(String(rowLink.value.href))
}
</script>

<style lang="scss" scoped>
@use '~/app/styles/variables' as var;

.table__row {
  border-bottom: 1px solid var.$paleMD;
  transition: background-color 0.2s var.$animation;

  &:last-of-type {
    border-bottom: none
  }

  &:nth-of-type(odd) {
    background-color: var.$paleLW;
  }

  &:hover {
    background-color: var.$paleMD;
    transition: background-color 0.2s var.$animation;
  }
}
</style>
