<template>
  <td class="table__row-cell">
    <component :is="cellComponent" />
  </td>
</template>

<script setup lang="ts">
import { h, computed } from 'vue'
import { RouterLink } from 'vue-router'
import type { JSONSchema4, JSONSchema4TypeName } from 'json-schema'

interface Props {
  cell: TableCellConfig<JSONSchema4TypeName, JSONSchema4>
}

const props = defineProps<Props>()

const renderElements = (schema: JSONSchema4, value: JSONSchema4TypeName) => {
  switch(schema.element) {
    case 'img':
      return h(
        'img',
        { src: value },
      )
    case 'RouterLink':
      return h(
        RouterLink,
        { to: value }
      )
    case 'a':
      return h(
        'a',
        { href: value, target: schema.isInnerPage ? '_self' : '_blank' }
      )
    default:
      return h(
        'span',
        {},
        value
      )
  }
}

const cellComponent = computed(() => {
  if ('element' in props.cell.schema) {
    return renderElements(props.cell.schema, props.cell.value)
  }

  if (Array.isArray(props.cell.value)) {
    return h(
      'span',
      {},
      props.cell.value.join(', ')
    )
  }

  return h(
    'span',
    {},
    props.cell.value
  )
})
</script>

<style lang="scss" scoped>
@import '~/scss/variables.scss';
@import 'include-media';

.table__row-cell {
  padding: 0.25rem;
  vertical-align: middle;

  img {
    width: 50px;
    height: 50px;
    max-width: 50px;
    max-height: 50px;
    object-fit: contain;
    border-radius: $borderRadiusSM;
  }

  span {
    font-size: 0.875rem;
  }
}
</style>
