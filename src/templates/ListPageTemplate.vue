<template>
  <section class="template">
    <transition name="fade">
      <Preloader
        v-if="!isDataFetched"
        mode="light"
      />
    </transition>
    <transition-group name="flyUp">
      <Header
        v-if="pageHeading"
        :heading="pageHeading"
        :withSearch="withSearch"
      >
        <slot name="header"></slot>
        <slot name="under-header"></slot>
      </Header>
      <CardList
        v-if="isDataFetched && dataList.length"
        key="list"
        :isDisabled="!isDraggable"
        @orderChanged="(event) => $emit('orderChanged', event)"
      >
        <AdapterCard
          v-for="item in dataList"
          :key="item._id"
          :card="item"
          :isDraggable="Boolean(isDraggable)"
          :placeholderImage="placeholderImage"
          @deleteEntity="(payload: unknown) => $emit('deleteEntity', payload)"
        />
      </CardList>
      <Paginator
        v-if="pagePagination && pagePagination.totalPages > 1"
        key="pagination"
        :config="paginationConfig"
        :pagination="pagePagination"
        :style="{ marginTop: 'auto' }"
        @switchPagination="switchPagination"
        @changeLimit="setEntitiesLimit"
      />
    </transition-group>
    <slot name="modal"></slot>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { BasicEntity, Pagination, PaginationConfig } from '~/types/Common'
import ListCardBasic from '~/classes/ListCardBasic'
import Preloader from '~/components/Preloader.vue'
import Header from '~/components/Header.vue'
import CardList from '~/components/Cards/CardList.vue'
import AdapterCard from '~/components/Cards/AdapterCard.vue'
import Paginator from '~/components/Paginator.vue'

interface Props {
  isDataFetched: boolean
  dataList: Array<BasicEntity & ListCardBasic>
  placeholderImage: string
  pagePagination?: Pagination
  switchPagination?: (page: number) => void
  setEntitiesLimit?: (limit: number) => void
  pageHeading?: string
  withSearch?: boolean
  isDraggable?: boolean
}

const props = defineProps<Props>()

const paginationConfig = computed<PaginationConfig>(() => ({
  limiter: [12, 15, 18, 30, 45, 48, 60, 75, 78, 100, 102],
  increment: true,
  decrement: true,
  selected: props.pagePagination?.limit || 15
}))
</script>
