<template>
  <table class="table">
    <TableRow
      v-for="row in tableState.rows"
      :row="row"
      :schema="tableState.schema"
    />
  </table>
</template>

<script setup lang="ts">
import type { JSONSchema4, JSONSchema4Type } from 'json-schema'
import TableRow from './TableRow.vue'

interface Props {
  tableState: TableConfig<Record<string, JSONSchema4Type>, JSONSchema4>
}

const props = defineProps<Props>()
</script>

<style lang="scss">
@import '~/scss/variables.scss';
@import 'include-media';

.table {
  width: 100%;
}
</style>
