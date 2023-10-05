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
  >
    <template v-slot:header>
      <!-- <Dropdown
        :options="sortingOptions"
        @chooseItem="switchSorting"
      /> -->
    </template>
  </ListPageTemplate>
</template>

<script lang="ts">
import { defineComponent, onMounted, computed, watch } from 'vue'
import { AlbumItem } from '~/types/Album'
import { CardBasic } from '~/types/Global'
import { AlbumCardBoxDTO } from '~/dto/AlbumCardBoxDTO'
import { useListPage } from '~/hooks/useListPage'
import ListPageTemplate from '~/templates/ListPageTemplate.vue'
import Dropdown from '~/components/Dropdown/Dropdown.vue'

export default defineComponent({
  name: 'AlbumsList',
  components: {
    ListPageTemplate,
    Dropdown,
  },
  setup() {
    const {
      fetchData,
      isDataFetched,
      entities,
      pagePagination,
      pageStateConfig,
      switchPagination,
      sortingOptions,
      switchSorting
    } = useListPage<AlbumItem>()

    const pageHeading = computed(() => (
      `The collection contains ${pagePagination.value?.totalDocs || 0} albums`
    ))

    const albumList = computed<CardBasic[]>(() => (
      entities.map((album) => new AlbumCardBoxDTO(album))
    ))    

    watch(pageStateConfig, () => fetchData('albums'))    
    onMounted(() => fetchData('albums'))

    return {
      pageHeading,
      albumList,
      pagePagination,
      isDataFetched,
      sortingOptions,
      switchSorting,
      switchPagination
    }
  }
})
</script>
