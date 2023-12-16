<template>
  <ListPageTemplate
    cardType="CardBox"
    rootPath="albums"
    cardClass="card-box"
    placeholderImage="/img/album.webp"
    :isDataFetched="isDataFetched"
    :pageHeading="pageHeading"
    :dataList="entities"
    :pagePagination="pagePagination"
    :switchPagination="switchPagination"
    :setEntitiesLimit="setEntitiesLimit"
  >
    <!-- <template v-slot:header></template> -->
  </ListPageTemplate>
</template>

<script lang="ts">
import { defineComponent, computed, watch } from 'vue'
import { CardBasic } from '~/types/Common'
import { AlbumItemRes } from '~/types/ReqRes'
import { useListPage } from '~/hooks/useListPage'
import { useLocales } from '~/hooks/useLocales'
import { isObjectsEquals } from '~/utils'
import AlbumCardBox from '~/classes/AlbumCardBox'
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
      entities,
      pagePagination,
      pageStateConfig,
      switchPagination,
      setEntitiesLimit
    } = useListPage<AlbumItemRes, AlbumItem>(AlbumItem)
    
    const { lang } = useLocales()

    const pageHeading = computed(() => (
      lang(`headings.albumsPage`, pagePagination.value?.totalDocs || 0)
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
      entities,
      pagePagination,
      isDataFetched,
      switchPagination,
      setEntitiesLimit
    }
  }
})
</script>
~/classes/AlbumCardBox