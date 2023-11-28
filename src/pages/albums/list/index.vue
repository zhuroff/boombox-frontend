<template>
  <ListPageTemplate
    cardType="CardBox"
    rootPath="albums"
    cardClass="card-box"
    placeholderImage="/img/album.webp"
    :isDataFetched="isDataFetched"
    :pageHeading="pageHeading"
    :dataList="albumList"
    :pagePagination="pagePagination"
    :switchPagination="switchPagination"
    :setEntitiesLimit="setEntitiesLimit"
  >
    <!-- <template v-slot:header></template> -->
  </ListPageTemplate>
</template>

<script lang="ts">
import { defineComponent, computed, watch } from 'vue'
import { AlbumItem } from '~/types/Album'
import { CardBasic } from '~/types/Common'
import { AlbumCardBoxDTO } from '~/dto/AlbumCardBoxDTO'
import { useListPage } from '~/hooks/useListPage'
import { useLocales } from '~/hooks/useLocales'
import { isObjectsEquals } from '~/utils'
import ListPageTemplate from '~/templates/ListPageTemplate.vue'

export default defineComponent({
  name: 'AlbumsList',
  components: {
    ListPageTemplate
  },
  setup() {
    const {
      fetchData,
      isDataFetched,
      entities,
      pagePagination,
      pageStateConfig,
      switchPagination,
      setEntitiesLimit
    } = useListPage<AlbumItem>()
    
    const { lang } = useLocales()

    const pageHeading = computed(() => (
      lang(`headings.albumsPage`, pagePagination.value?.totalDocs || 0)
    ))

    const albumList = computed<CardBasic[]>(() => (
      entities.value.map((album) => new AlbumCardBoxDTO(album))
    )) 
    
    watch(
      pageStateConfig,
      (newVal, oldVal) => {
        !isObjectsEquals(newVal, oldVal) && fetchData('albums')
      },
      { immediate: true }
    )

    return {
      pageHeading,
      albumList,
      pagePagination,
      isDataFetched,
      switchPagination,
      setEntitiesLimit
    }
  }
})
</script>
