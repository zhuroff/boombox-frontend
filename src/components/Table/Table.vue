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
            v-if="value.format === 'uri' && value.href"
            :href="row[value.href as keyof DiscogsReleaseRow]"
            target="_blank"
          >{{ row[key] }}</a>
          <img
            v-else-if="value.format === 'uri' && value.contentMediaType.includes('image')"
            :src="row[key]"
            :style="{
              width: '100px',
              height: '100px',
              objectFit: 'cover'
            }"
          />
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
import { DiscogsPayload } from '~/types/Discogs'

export default defineComponent({
  name: 'Table',
  props: {
    tableState: {
      type: Object as PropType<DiscogsPayload>,
      required: true
    }
  },
  setup({ tableState }) {
    const propMap: ComputedRef<Map<string, JSONSchema4>> = computed(() => (
      new Map([...Object.entries(tableState.schema.properties)])
    ))

    return {
      propMap 
    }
  }
})
</script>
