<template>
  <ListPageTemplate
    placeholderImage="/img/artist.webp"
    :isDataFetched="isDataFetched"
    :pageHeading="pageHeading"
    :dataList="artists"
    :pagePagination="pagePagination"
    :switchPagination="switchPagination"
    :setEntitiesLimit="setEntitiesLimit"
  />
</template>

<script lang="ts">
import { defineComponent, onMounted, computed, watch, ref } from 'vue'
import { useListPage } from '~/hooks/useListPage'
import { CategoryItemRes } from '~/types/ReqRes'
import ListPageTemplate from '~/templates/ListPageTemplate.vue'
import CategoryItem from '~/classes/CategoryItem'

export default defineComponent({
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
    } = useListPage<CategoryItemRes, CategoryItem>(CategoryItem, 'CategoryCard', 'artists')

    const artists = ref<CategoryItem[]>([])

    const pageHeading = computed(() => (
      `There are ${pagePagination.value?.totalDocs || 0} artists in collection`
    ))

    watch(pageStateConfig, () => {
      fetchData('artists')
        .then((data) => artists.value = data || [])
    })

    onMounted(() => {
      fetchData('artists')
        .then((data) => artists.value = data || [])
    })

    return {
      artists,
      pageHeading,
      pagePagination,
      isDataFetched,
      switchPagination,
      setEntitiesLimit
    }
  }
})
</script>
