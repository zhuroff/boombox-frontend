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
    <template v-slot:header>
      <!-- <Dropdown
        :options="sortingOptions"
        @chooseItem="switchSorting"
      /> -->
    </template>
  </ListPageTemplate>
</template>

<script lang="ts">
import { defineComponent, computed, watch, ref } from 'vue'
import { AlbumItem } from '~/types/Album'
import { CardBasic } from '~/types/Global'
import { AlbumCardBoxDTO } from '~/dto/AlbumCardBoxDTO'
import { useListPage } from '~/hooks/useListPage'
import { isObjectsEquals } from '~/shared/checker'
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
      setEntitiesLimit,
      sortingOptions,
      switchSorting
    } = useListPage<AlbumItem>()

    const pageHeading = computed(() => (
      `The collection contains ${pagePagination.value?.totalDocs || 0} albums`
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
      sortingOptions,
      switchSorting,
      switchPagination,
      setEntitiesLimit
    }
  }
})
</script>
