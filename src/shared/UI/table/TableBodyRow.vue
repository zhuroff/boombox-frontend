<template>
  <tr
    class="table__body-row"
    :style="{ cursor: isActionable ? 'pointer' : 'default' }"
    @click="() => isActionable && emit('tableRowClick', row)"
  >
    <component
      v-for="key in schema.order"
      :key="key"
      :is="cellComponent(key)"
    />
  </tr>
</template>

<script setup lang="ts">
import { h } from 'vue'
import { RouterLink } from 'vue-router'
import type { JSONSchema4, JSONSchema4Type } from 'json-schema'
import type { LocaleItem, TableRow, TableSchema } from '~shared/lib'

type Props = {
  row: TableRow
  schema: TableSchema,
  isActionable?: boolean
  currentLocale?: LocaleItem
}

type Emits = {
  (e: 'tableRowClick', payload: TableRow): void
}

const props = withDefaults(defineProps<Props>(), {
  isActionable: false
})

const emit = defineEmits<Emits>()

const dateConfig = {
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit'
} as const

const formatValue = (value: string, schema: JSONSchema4) => {
  if (schema.format === 'date-time' && props.currentLocale) {
    return (
      new Date(Number(value))
        .toLocaleDateString(props.currentLocale.intlName, dateConfig)
    )
  }

  return value
}

const unwrapValue = (value: JSONSchema4Type) => {
  return Array.isArray(value) ? value.join(', ') : value ? String(value) : 'N/A'
}

const renderElement = (key: keyof TableRow, schema: JSONSchema4) => {
  const value = unwrapValue(props.row[key])

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

const cellComponent = (key: keyof TableRow) => {
  const schemaConfig = props.schema.properties?.[key]
  const value = unwrapValue(props.row[key])
  
  if (!schemaConfig) {
    return h('td', {}, value)
  }

  if ('element' in schemaConfig) {
    return h(
      'td',
      {},
      renderElement(key, schemaConfig)
    )
  }

  return h('td', {}, formatValue(value, schemaConfig))
}
</script>

<style lang="scss" scoped>
@use '~/app/styles/variables' as var;

.table__body-row {
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

  td {
    padding: 0.25rem;
    vertical-align: middle;
    font-size: 0.875rem;

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
}
</style>
