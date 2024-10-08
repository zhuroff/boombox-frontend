<template>
  <!-- <ListPageTemplate
    placeholderImage="/img/artist.webp"
    :isDataFetched="isDataFetched"
    :pageHeading="pageHeading"
    :dataList="artists"
    :pagePagination="pagePagination"
    :switchPagination="switchPagination"
    :setEntitiesLimit="setEntitiesLimit"
  /> -->
  <EntityListTemplate
    entityKey="artists"
    placeholderPreview="/img/artist.webp"
    pageHeadingKey="headings.artistsPage"
  />
</template>

<script setup lang="ts">
import EntityListTemplate from '~/templates/EntityListTemplate.vue'

// import { onMounted, computed, watch, reactive } from 'vue'
// import { useListPage } from '~/hooks/useListPage'
// import useGlobalStore from '~/store/global'
// import type { CategoryItemRes } from '~/types/ReqRes'
// import ListPageTemplate from '~/templates/ListPageTemplate.vue'
// import CategoryItem from '~/classes/CategoryItem'

// const {
//   fetchData,
//   isDataFetched,
//   pagePagination,
//   pageStateConfig,
//   switchPagination,
//   setEntitiesLimit
// } = useListPage<CategoryItemRes, CategoryItem>(CategoryItem, 'CategoryCard', 'artists')

// const {
//   globalGetters: { localize }
// } = useGlobalStore()

// const artists = reactive<CategoryItem[]>([])

// const pageHeading = computed(() => (
//   localize('headings.artistsPage', String(pagePagination.value?.totalDocs || 0))
// ))

// watch(pageStateConfig, () => {
//   fetchData('artists')
//     .then((data) => {
//       artists.splice(0, artists.length, ...data || [])
//     })
// })

// onMounted(() => {
//   fetchData('artists')
//     .then((data) => {
//       artists.splice(0, artists.length, ...data || [])
//     })
// })
</script>
