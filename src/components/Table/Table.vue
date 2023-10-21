<template>
  <table>
    <tbody>
      <tr
        v-for="row in tableState.rows"
        :key="row.id"
      >
        <td
          v-for="[key, value] in propMap"
          :key="key"
        >
          <a
            v-if="
              value.format === 'uri' &&
              value.href &&
              !value.contentMediaType.includes('image')
            "
            :href="row[value.href]"
            target="_blank"
          >{{ row[key] }}</a>
          <div
            v-else-if="value.format === 'uri' && value.contentMediaType.includes('image')"
            :style="{
              width: '70px',
              height: '70px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }"
          >
            <img              
              :src="row[key]"
              :style="{
                maxWidth: '70px',
                maxHeight: '70px',
                objectFit: 'contain',
                cursor: value.href ? 'pointer' : 'default'
              }"
              @click="value.href && openExternalLink(row[value.href])"
            />
          </div>
          <span v-else-if="value.type === 'array'">
            {{ row[key].join(', ') }}
          </span>
          <span v-else>{{ row[key] }}</span>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script lang="ts">
import { JSONSchema4 } from 'json-schema'
import { ComputedRef, PropType, computed, defineComponent } from 'vue'
import { TablePayload } from '~/types/Global'

export default defineComponent({
  name: 'Table',
  props: {
    tableState: {
      type: Object as PropType<TablePayload<object>>,
      required: true
    }
  },
  setup({ tableState }) {
    const propMap: ComputedRef<Map<string, JSONSchema4>> = computed(() => (
      new Map([...Object.entries(tableState.schema.properties || {})])
    ))

    const openExternalLink = (url: string) => {
      window.open(url)
    }

    return {
      propMap,
      openExternalLink
    }
  }
})
</script>
