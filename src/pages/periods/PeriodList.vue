<template>
  <ListPageTemplate
    placeholderImage="/img/period.webp"
    :isDataFetched="isDataFetched"
    :pageHeading="pageHeading"
    :dataList="periods"
    :pagePagination="pagePagination"
    :switchPagination="switchPagination"
    :setEntitiesLimit="setEntitiesLimit"
  />
</template>

<script setup lang="ts">
import { onMounted, computed, watch, reactive } from 'vue'
import { useListPage } from '~/hooks/useListPage'
import useGlobalStore from '~/store/global'
import { CategoryItemRes } from '~/types/ReqRes'
import ListPageTemplate from '~/templates/ListPageTemplate.vue'
import CategoryItem from '~/classes/CategoryItem'

const {
  fetchData,
  isDataFetched,
  pagePagination,
  pageStateConfig,
  switchPagination,
  setEntitiesLimit
} = useListPage<CategoryItemRes, CategoryItem>(CategoryItem, 'CategoryCard', 'periods')

const {
  globalGetters: { localize }
} = useGlobalStore()

const periods = reactive<CategoryItem[]>([])

const pageHeading = computed(() => (
  localize('headings.periodsPage', String(pagePagination.value?.totalDocs || 0))
))

watch(pageStateConfig, () => {
  fetchData('periods')
    .then((data) => {
      periods.splice(0, periods.length, ...data || [])
    })
})

onMounted(() => {
  fetchData('periods')
    .then((data) => {
      periods.splice(0, periods.length, ...data || [])
    })
})
</script>
