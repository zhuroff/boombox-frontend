<template>
  <ListPageTemplate
    placeholderImage="/img/album.webp"
    :isDataFetched="isDataFetched"
    :pageHeading="pageHeading"
    :dataList="albums"
    :pagePagination="pagePagination"
    :switchPagination="switchPagination"
    :setEntitiesLimit="setEntitiesLimit"
  />
</template>

<script setup lang="ts">
import { computed, watch, reactive } from 'vue'
import { AlbumItemRes } from '~/types/ReqRes'
import { useListPage } from '~/hooks/useListPage'
import useGlobalStore from '~/store/global'
import { isObjectsEquals } from '~/utils'
import ListPageTemplate from '~/templates/ListPageTemplate.vue'
import AlbumItem from '~/classes/AlbumItem'

const {
  fetchData,
  isDataFetched,
  pagePagination,
  pageStateConfig,
  switchPagination,
  setEntitiesLimit
} = useListPage<AlbumItemRes, AlbumItem>(AlbumItem, 'AlbumCard', 'albums')

const {
  globalGetters: { localize }
} = useGlobalStore()

const albums = reactive<AlbumItem[]>([])

const pageHeading = computed(() => (
  localize(`headings.albumsPage`, String(pagePagination.value?.totalDocs || 0))
))

watch(
  pageStateConfig,
  (newVal, oldVal) => {
    if (!isObjectsEquals(newVal, oldVal)) {
      fetchData('albums')
        .then((payload) => {
          albums.splice(0, albums.length, ...payload || [])
        })
    }
  },
  { immediate: true }
)
</script>
