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
    />
  </tr>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { JSONSchema4, JSONSchema4TypeName } from 'json-schema'
import TableBodyCell from './TableBodyCell.vue'

interface Props {
  row: Record<string, JSONSchema4TypeName>
  schema: JSONSchema4
}

const props = defineProps<Props>()

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
    ? window.location.href = rowLink.value.href
    : window.open(rowLink.value.href)
}
</script>

<style lang="scss" scoped>
@import '~/scss/variables.scss';
@import 'include-media';

.table__row {
  border-bottom: 1px solid $paleMD;
  transition: background-color 0.2s $animation;

  &:last-of-type {
    border-bottom: none
  }

  &:nth-of-type(odd) {
    background-color: $paleLW;
  }

  &:hover {
    background-color: $paleMD;
    transition: background-color 0.2s $animation;
  }
}
</style>
