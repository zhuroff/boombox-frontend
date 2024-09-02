<template>
  <ListPageTemplate
    placeholderImage="/img/artist.webp"
    :isDataFetched="isDataFetched"
    :pageHeading="pageHeading"
    :dataList="genres"
    :pagePagination="pagePagination"
    :switchPagination="switchPagination"
    :setEntitiesLimit="setEntitiesLimit"
  />
</template>

<script setup lang="ts">
import { onMounted, computed, watch, reactive } from 'vue'
import { useListPage } from '~/hooks/useListPage'
import useGlobalStore from '~/store/global'
import type { CategoryItemRes } from '~/types/ReqRes'
import ListPageTemplate from '~/templates/ListPageTemplate.vue'
import CategoryItem from '~/classes/CategoryItem'

const {
  fetchData,
  isDataFetched,
  pagePagination,
  pageStateConfig,
  switchPagination,
  setEntitiesLimit
} = useListPage<CategoryItemRes, CategoryItem>(CategoryItem, 'CategoryCard', 'genres')

const {
  globalGetters: { localize, authConfig }
} = useGlobalStore()

const genres = reactive<CategoryItem[]>([])

const pageHeading = computed(() => (
  localize('headings.genresPage', String(pagePagination.value?.totalDocs || 0))
))

watch(pageStateConfig, () => {
  fetchData('genres')
    .then((data) => {
      genres.splice(0, genres.length, ...data || [])
    })
})

onMounted(() => {
  fetchData('genres')
    .then((data) => {
      genres.splice(0, genres.length, ...data || [])
    })
})
</script>
