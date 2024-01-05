<template>
  <ListPageTemplate
    placeholderImage="/img/album.webp"
    :isDataFetched="isDataFetched"
    :pageHeading="pageHeading"
    :dataList="collections"
    :pagePagination="pagePagination"
    :switchPagination="switchPagination"
    :setEntitiesLimit="setEntitiesLimit"
    @deleteEntity="deleteCollection"
  />
</template>

<script lang="ts">
import { defineComponent, computed, ref, watch } from 'vue'
import { useListPage } from '~/hooks/useListPage'
import { useLocales } from '~/hooks/useLocales'
import { CollectionEntityRes } from '~/types/ReqRes'
import { BasicEntity } from '~/types/Common'
import { isObjectsEquals } from '~/utils'
import CollectionEntity from '~/classes/CollectionEntity'
import ListPageTemplate from '~/templates/ListPageTemplate.vue'

export default defineComponent({
  name: 'CollectionsList',
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
      setEntitiesLimit,
      deleteEntity
    } = useListPage<
      CollectionEntityRes<BasicEntity>,
      CollectionEntity<BasicEntity>
    >(CollectionEntity, 'CollectionCard', 'collections')

    const { lang } = useLocales()
    const collections = ref<CollectionEntity<BasicEntity>[]>([])

    const pageHeading = computed(() => (
      lang(`headings.collectionsPage`, pagePagination.value?.totalDocs || 0)
    ))

    const deleteCollection = (id: string) => {
      deleteEntity('collections', id)
        .then(() => {
          fetchData('collections')
            .then((payload) => collections.value = payload || [])
        })
    }

    watch(
      pageStateConfig,
      (newVal, oldVal) => {
        if (!isObjectsEquals(newVal, oldVal)) {
          fetchData('collections')
            .then((payload) => collections.value = payload || [])
        }
      },
      { immediate: true }
    )

    return {
      isDataFetched,
      pagePagination,
      switchPagination,
      setEntitiesLimit,
      deleteCollection,
      pageHeading,
      collections
    }
  }
})
</script>
