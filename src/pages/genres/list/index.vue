<template>
  <ListPageTemplate
    placeholderImage="/img/artist.webp"
    :isDataFetched="isDataFetched"
    :pageHeading="pageHeading"
    :dataList="genres"
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
    } = useListPage<CategoryItemRes, CategoryItem>(CategoryItem, 'CategoryCard', 'genres')
    const { lang } = useLocales()

    const genres = reactive<CategoryItem[]>([])

    const pageHeading = computed(() => (
      lang('headings.genresPage', String(pagePagination.value?.totalDocs || 0))
    ))

    watch(pageStateConfig, () => {
      fetchData('genres')
        .then((data) => {
          genres.splice(0, genres.length, ...data || [])
        })
    })

    onMounted(() => {
      fetchData('genres')
        .then((data) => {
          genres.splice(0, genres.length, ...data || [])
        })
    })

    return {
      genres,
      pageHeading,
      pagePagination,
      isDataFetched,
      switchPagination,
      setEntitiesLimit
    }
  }
})
</script>
