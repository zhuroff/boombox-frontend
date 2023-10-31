<template>
  <table class="table">
    <thead>
      <tr class="table__row">
        <th
          v-for="[key] in propMap"
          :key="key"
          class="table__cell-head"
        >{{ key }}</th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="row in tableState.rows"
        :key="row.id"
        class="table__row"
      >
        <td
          v-for="[key, value] in propMap"
          :key="key"
          class="table__cell-body"
        >
          <a
            v-if="
              value.format === 'uri' &&
              value.href &&
              !value.contentMediaType.includes('image')
            "
            :href="row[value.href]"
            class="table__cell-link"
            target="_blank"
          >{{ row[key] }}</a>
          <div
            v-else-if="value.format === 'uri' && value.contentMediaType.includes('image')"
            class="table__cell-image"
          >
            <img              
              :src="row[key]"
              :style="{ cursor: value.href ? 'pointer' : 'default' }"
              @click="value.href && openExternalLink(row[value.href])"
            />
          </div>
          <span
            v-else-if="value.type === 'array'"
            class="table__cell-string"
          >
            {{ row[key].join(', ') }}
          </span>
          <span
            v-else
            class="table__cell-string"
          >{{ row[key] }}</span>
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
      type: Object as PropType<TablePayload<Record<string, any>>>,
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

<style lang="scss" scoped>
@import '../../scss/variables.scss';
@import 'include-media';

.table {
  width: 100%;

  &__row {
    border-bottom: 1px solid $border;

    &:hover {
      background-color: $border;
    }
  }

  &__cell {

    &-head {
      font-weight: 600;
    }
    
    &-body {
      vertical-align: middle;
    }

    &-link,
    &-string {
      padding: 0.5rem 0.75rem;
      display: block;
    }

    &-image {
      width: 50px;
      height: 50px;
      max-width: 50px;
      max-height: 50px;
      display: flex;
      justify-content: center;
      align-items: center;

      img {
        max-width: inherit;
        max-height: inherit;
        object-fit: contain;
        border-radius: $borderRadiusSM;
      }
    }
  }
}
</style>
