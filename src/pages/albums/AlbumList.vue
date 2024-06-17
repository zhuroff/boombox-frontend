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

<script lang="ts">
import { defineComponent, computed, watch, reactive } from 'vue'
import { AlbumItemRes } from '~/types/ReqRes'
import { useListPage } from '~/hooks/useListPage'
import { useLocales } from '~/hooks/useLocales'
import { isObjectsEquals } from '~/utils'
import ListPageTemplate from '~/templates/ListPageTemplate.vue'
import AlbumItem from '~/classes/AlbumItem'

export default defineComponent({
  name: 'AlbumsList',
  components: {
    ListPageTemplate
  },
  setup() {
    const {
      fetchData,
      isDataFetched,
      pagePagination,
      pageStateConfig,
      switchPagination,
      setEntitiesLimit
    } = useListPage<AlbumItemRes, AlbumItem>(AlbumItem, 'AlbumCard', 'albums')
    
    const { lang } = useLocales()
    const albums = reactive<AlbumItem[]>([])

    const pageHeading = computed(() => (
      lang(`headings.albumsPage`, String(pagePagination.value?.totalDocs || 0))
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

    return {
      albums,
      pageHeading,
      pagePagination,
      isDataFetched,
      switchPagination,
      setEntitiesLimit
    }
  }
})
</script>
