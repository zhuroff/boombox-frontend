<template>
  <Button
    v-if="isTableReady && isFiltersApplied"
    size="small"
    :label="localize('discogsTable.resetFilters')"
    :onClick="resetDiscogsFilters"
  />
  <Table
    v-if="isTableReady"
    :rows="paginatedDiscogsData"
    :filters="discogsFilters"
    :schema="discogsTableSchema"
    :headerConfig="tableHeaderConfig"
    :isActionable="true"
    @tableRowClick="handleTableRowClick"
  />
  <Paginator
    v-if="isTableReady"
    :paginationState="paginationState"
    :paginationConfig="paginationConfig"
    :updatePaginationState="updatePaginationState"
  />
</template>

<script setup lang="ts">
import { h, computed, watch, watchEffect, type ComputedRef } from 'vue'
import { Button, Select } from '~shared/UI'
import { useDevice, useLocalization } from '~shared/model'
import { useDiscogs, discogsTableSchema, DiscogsService } from '~features/discogs'
import { Paginator, usePaginator } from '~features/paginator'
import { Table } from '~features/table'
import type { MinimumAlbumInfo, TableHeaderConfig, TableRow } from '~shared/lib'

const discogsService = new DiscogsService()

interface Props {
  entity: MinimumAlbumInfo | MinimumAlbumInfo[]
}

const props = defineProps<Props>()
const { isMobile } = useDevice()
const { localize } = useLocalization()

const discogsPayload = computed(() => {
  if (Array.isArray(props.entity)) {
    return props.entity.map((item) => ({
      artist: item.albumArtist,
      album: item.albumTitle,
      isMasterOnly: 1 as const,
      page: 1
    }))
  }
  
  return {
    artist: props.entity.albumArtist,
    album: props.entity.albumTitle,
    isMasterOnly: 0 as const,
    page: 1
  }
})

const {
  searchDiscogsData,
  setDiscogsFilterValue,
  resetDiscogsFilters,
  discogsFiltersState,
  filteredDiscogsData,
  isDiscogsSearching,
  discogsFilters
} = useDiscogs(discogsService)

const {
  paginationState,
  paginationConfig,
  updatePaginationConfig,
  updatePaginationState
} = usePaginator({ isRouted: false })

const discogsPagination = computed(() => ({
  ...paginationState.value,
  totalDocs: filteredDiscogsData.value.length,
  totalPages: Math.floor(filteredDiscogsData.value.length / paginationState.value.limit),
}))

const paginatedDiscogsData: ComputedRef<TableRow[]> = computed(() => (
  [...filteredDiscogsData.value]
    .splice(
      (discogsPagination.value.page - 1) * discogsPagination.value.limit,
      discogsPagination.value.limit
    )
    .map(row => ({
      ...row,
      id: String(row.id)
    }))
))

const isTableReady = computed(() => (
  !isDiscogsSearching.value && paginatedDiscogsData.value.length
))

const isFiltersApplied = computed(() => (
  Object.values(discogsFiltersState).some((value) => value !== null)
))

const tableHeaderConfig = computed<TableHeaderConfig[]>(() => (
  discogsTableSchema.order.map((key) => {
    const filter = discogsTableSchema.filters?.[key]
    const heading = localize(`discogsTable.${key}`)

    if (!filter) {
      return {
        key,
        element: h('span', {}, heading)
      }
    }

    return {
      key,
      element: h(
        Select,
        {
          options: [
            heading,
            ...discogsFilters[key]
          ],
          modelValue: discogsFiltersState[key],
          localeKey: 'discogsTable',
          entityKey: key,
          size: 'small',
          onPassSelectedValue: (value) => {
            setDiscogsFilterValue(value)
            updatePaginationState('page', 1)
          }
        }
      )
    }
  })
))

const handleTableRowClick = (row: TableRow) => {
  window.open(String(row.pageURL))
}

watch(
  filteredDiscogsData,
  (value) => {
    if (!value) return
    updatePaginationConfig('totalDocs', value.length)
    updatePaginationConfig('totalPages', Math.ceil(value.length / paginationState.value.limit))
  }
)

watchEffect(() => {
  if (discogsPayload.value && !isMobile.value) {
    searchDiscogsData(discogsPayload.value)
  }
})
</script>

<style lang="scss" scoped>
.table {
  margin-top: 1rem;
}
</style>
