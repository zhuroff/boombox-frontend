<template>
  <ListPageTemplate
    placeholderImage="/img/album.webp"
    :isDataFetched="isDataFetched"
    :pageHeading="pageHeading"
    :dataList="collections"
    :pagePagination="pagePagination"
    :switchPagination="switchPagination"
    :setEntitiesLimit="setEntitiesLimit"
  />
</template>

<script lang="ts">
import { defineComponent, computed, ref, watch } from 'vue'
import { useListPage } from '~/hooks/useListPage'
import { useLocales } from '~/hooks/useLocales'
import { CollectionEntityRes } from '~/types/ReqRes'
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
      setEntitiesLimit
    } = useListPage<
      CollectionEntityRes<number>,
      CollectionEntity<number>
    >(CollectionEntity, 'CollectionCard', 'collections')

    const { lang } = useLocales()
    const collections = ref<CollectionEntity<number>[]>([])

    const pageHeading = computed(() => (
      lang(`headings.albumsPage`, pagePagination.value?.totalDocs || 0)
    ))

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
      pageHeading,
      collections
    }
  }
})
</script>
