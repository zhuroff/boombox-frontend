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
import { defineComponent, onMounted, computed, watch, reactive } from 'vue'
import { useListPage } from '~/hooks/useListPage'
import { useLocales } from '~/hooks/useLocales'
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
    const { lang } = useLocales()

    const artists = reactive<CategoryItem[]>([])

    const pageHeading = computed(() => (
      lang('headings.artistsPage', String(pagePagination.value?.totalDocs || 0))
    ))

    watch(pageStateConfig, () => {
      fetchData('artists')
        .then((data) => {
          artists.splice(0, artists.length, ...data || [])
        })
    })

    onMounted(() => {
      fetchData('artists')
        .then((data) => {
          artists.splice(0, artists.length, ...data || [])
        })
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
