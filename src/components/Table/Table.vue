<template>
  <div v-if="tableState.rows.length > 0">
    <div class="table__filters">
      
    </div>
    <table class="table">
      <thead>
        <tr class="table__row">
          <th
            v-for="[key] in propMap"
            :key="key"
            class="table__cell-head"
          >
            <span class="table__cell-text">{{ key }}</span>
          </th>
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
              class="table__cell-text"
            >
              {{ row[key].join(', ') }}
            </span>
            <span
              v-else
              class="table__cell-text"
            >{{ row[key] }}</span>
          </td>
        </tr>
      </tbody>
    </table>
    <Paginator
      v-if="tableState.pagination?.totalPages > 1"
      key="pagination"
      :config="paginationConfig"
      :pagination="tableState.pagination"
      @switchPagination="switchPagination"
    />
  </div>
</template>

<script lang="ts">
import { JSONSchema4 } from 'json-schema'
import { ComputedRef, PropType, computed, defineComponent, ref } from 'vue'
import { PaginationConfig, TablePayload } from '~/types/Global'
import Paginator from '~/components/Paginator.vue'

export default defineComponent({
  name: 'Table',
  components: {
    Paginator
  },
  props: {
    tableState: {
      type: Object as PropType<TablePayload<Record<string, any>>>,
      required: true
    }
  },
  setup({ tableState }, { emit }) {
    const propMap: ComputedRef<Map<string, JSONSchema4>> = computed(() => (
      new Map([...Object.entries(tableState.schema.properties || {})])
    ))

    const paginationConfig = ref<PaginationConfig>({
      view: 'buttons',
      increment: true,
      decrement: true
    })

    const openExternalLink = (url: string) => {
      window.open(url)
    }

    const switchPagination = (value: number) => {
      emit('switchPagination', value)
    }

    return {
      propMap,
      paginationConfig,
      openExternalLink,
      switchPagination
    }
  }
})
</script>

<style lang="scss" scoped>
@import '../../scss/variables.scss';
@import 'include-media';

.table {
  width: 100%;
  margin-bottom: 25px;

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
    &-text {
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
