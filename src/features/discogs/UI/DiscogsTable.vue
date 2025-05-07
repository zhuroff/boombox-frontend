<template>
  <Table
    :tableState="discogsTableState"
    :tableFilters="discogsFilters"
    :tableFiltersState="discogsFiltersState"
    localeRootKey="discogsTable"
    @updateFilterValue="(value) => setDiscogsFilterValue(value)"
  />
  <!-- <Table
    :tableState="discogsTableState"
    :tableFilters="discogsFilters"
    :tableFiltersState="discogsFiltersState"
    localeKey="discogsTable"
    @switchPagination="() => console.log('switchPagination')"
    @update:filter="() => console.log('updateDiscogsFilter')"
  /> -->
</template>

<script setup lang="ts">
import type { DiscogsPropEntity } from '../'
import { Table } from '~shared/UI'
import useDiscogs from '../model/useDiscogs'
import DiscogsService from '../api/DiscogsService'

const discogsService = new DiscogsService()

interface Props {
  entity: DiscogsPropEntity
}

const props = defineProps<Props>()

const {
  discogsTableState,
  discogsFiltersState,
  setDiscogsFilterValue,
  discogsFilters
} = useDiscogs(discogsService, props.entity)
</script>
