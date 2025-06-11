<template>
  <Table
    v-if="discogsTableState.rows.length"
    :tableState="discogsTableState"
    :tableFilters="discogsFilters"
    :tableFiltersState="discogsFiltersState"
    localeRootKey="discogsTable"
    @updateFilterValue="(value) => setDiscogsFilterValue(value)"
  >
    <template #tfoot>
      <Paginator
        v-if="isTablePaginated"
        :paginationState="discogsPagination"
        :paginationConfig="paginationConfig"
        :updatePaginationState="updatePaginationState"
      />
    </template>
  </Table>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Paginator } from '~shared/UI'
import { Table } from '~shared/UI'
import type { MinimumAlbumInfo } from '~shared/lib'
import useDiscogs from '../model/useDiscogs'
import DiscogsService from '../api/DiscogsService'

const discogsService = new DiscogsService()

interface Props {
  entity: MinimumAlbumInfo | MinimumAlbumInfo[]
}

const props = defineProps<Props>()

const {
  discogsTableState,
  discogsPagination,
  paginationConfig,
  discogsFiltersState,
  setDiscogsFilterValue,
  updatePaginationState,
  discogsFilters
} = useDiscogs(discogsService, props.entity)

const isTablePaginated = computed(() => (
  Number(discogsTableState.value.pagination?.totalPages) > 1
))
</script>
