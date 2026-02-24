<template>
  <tr class="table__head-row">
    <th
      v-for="cell in cells"
      :key="cell.key"
    >
      <component :is="cell.element" />
    </th>
  </tr>
</template>

<script setup lang="ts">
import type { TableHeaderConfig } from '~shared/lib'

type Props = {
  cells: TableHeaderConfig[]
}

defineProps<Props>()
</script>

<style lang="scss" scoped>
@use '~/app/styles/variables' as var;

.table__head-row {
  background-color: var.$paleLW;

  th {
    font-weight: 600;
    padding: 0.75rem 0;
    vertical-align: middle;
    font-size: 0.875rem;

    &.--right {
      text-align: right;
    }

    &.--center {
      text-align: center;
    }

    &:first-of-type {
      padding-left: 0.75rem;
      border-top-left-radius: var.$borderRadiusSM;
    }

    &:last-of-type {
      border-top-right-radius: var.$borderRadiusSM;
    }
  }
}
</style>
