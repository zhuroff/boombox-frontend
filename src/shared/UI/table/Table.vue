<template>
  <table class="table">
    <thead class="table__head">
      <TableHeadRow
        :cells="tableHeader"
        :filters="tableFilters"
        :filtersState="tableFiltersState"
        :localeRootKey="localeRootKey"
        @updateFilterValue="(value) => emit('updateFilterValue', value)"
      />
    </thead>
    <tbody class="table__body">
      <TableBodyRow
        v-for="row in tableState.rows"
        :row="row"
        :schema="tableState.schema"
        @onEmit="<T>(payload: T) => emit('onEmit', payload)"
      />
    </tbody>
    <tfoot class="table__footer">
      <slot name="tfoot"></slot>
    </tfoot>
  </table>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { JSONSchema4, JSONSchema4Type } from 'json-schema'
import { useTranslate } from '~usecases/localization'
import TableHeadRow from './TableHeadRow.vue'
import TableBodyRow from './TableBodyRow.vue'

interface Props {
  tableState: TableConfig<Record<string, JSONSchema4Type>, JSONSchema4>
  tableFilters?: TableFilters
  tableFiltersState?: Record<string, string | number | null>
  localeRootKey: string
}

interface Emits {
  <T>(e: 'onEmit', data: T): void
  (e: 'updateFilterValue', value: [string, string | number | null]): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const { localize } = useTranslate()

const tableHeader = computed<TableHeadConfig<JSONSchema4>[]>(() => (
  props.tableState.schema.order.map((key: string) => ({
    key,
    heading: localize(`${props.localeRootKey}.${key}`),
    schema: props.tableState.schema.properties?.[key],
    filter: props.tableState.schema.filters?.[key]
  }))
))
</script>

<style lang="scss">
.table {
  width: 100%;
}
</style>
