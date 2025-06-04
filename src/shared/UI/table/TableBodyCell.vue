<template>
  <td :class="cellClass">
    <component
      :is="cellComponent"
      @onEmit="<T>(payload: T) => emit('onEmit', payload)"
    />
  </td>
</template>

<script setup lang="ts">
import { h, computed, defineAsyncComponent, defineEmits } from 'vue'
import { RouterLink } from 'vue-router'
import type { JSONSchema4, JSONSchema4Type, JSONSchema4TypeName } from 'json-schema'
import { useTranslate } from '~usecases/localization'

interface Props {
  cell: TableCellConfig<JSONSchema4TypeName, JSONSchema4>
  row: Record<string, JSONSchema4Type>
}

interface Emits {
  <T>(e: string, data: T): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const dateConfig = {
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit'
} as const

const { currentLocale } = useTranslate()

const formatValue = (value: JSONSchema4TypeName, schema: JSONSchema4) => {
  if (schema.format === 'date-time') {
    return (
      new Date(Number(value))
        .toLocaleDateString(currentLocale.value.intlName, dateConfig)
    )
  }

  return value
}

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
        {
          href: value,
          target: schema.isInnerPage ? '_self' : '_blank'
        }
      )
    default:
      return h(
        'span',
        {},
        formatValue(value, schema)
      )
  }
}

const renderComponents = (schema: JSONSchema4) => {
  const AsyncComponent = defineAsyncComponent(() => import(schema.component))
  return h(
    AsyncComponent,
    {
      ...schema.props,
      value: props.row[schema.props.valueRef]
    }
  )
}

const cellComponent = computed(() => {
  if ('element' in props.cell.schema) {
    return renderElements(props.cell.schema, props.cell.value)
  } else if ('component' in props.cell.schema) {
    return renderComponents(props.cell.schema)
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
    formatValue(props.cell.value, props.cell.schema)
  )
})

const cellClass = computed(() => {
  const classArray = ['table__body-cell']
  
  if (props.cell.schema?.props?.align) {
    classArray.push(`--${props.cell.schema.props.align}`)
  }

  return classArray
})
</script>

<style lang="scss" scoped>
@use '~/app/styles/variables' as var;

.table__body-cell {
  padding: 0.25rem;
  vertical-align: middle;

  img {
    width: 50px;
    height: 50px;
    max-width: 50px;
    max-height: 50px;
    object-fit: contain;
    border-radius: var.$borderRadiusSM;
  }

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
