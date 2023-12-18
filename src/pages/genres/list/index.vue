<template>
  <ListPageTemplate
    cardType="CardCategory"
    rootPath="genres"
    cardClass="card-category"
    placeholderImage="/img/artist.webp"
    :isDataFetched="isDataFetched"
    :pageHeading="pageHeading"
    :dataList="genres"
    :pagePagination="pagePagination"
    :switchPagination="switchPagination"
  >
    <!-- <template v-slot:header></template> -->
  </ListPageTemplate>
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
      switchPagination
    } = useListPage<CategoryItemRes, CategoryItem>(CategoryItem)

    const genres = ref<CategoryItem[]>([])

    const pageHeading = computed(() => (
      `There are ${pagePagination.value?.totalDocs || 0} genres in collection`
    ))

    watch(pageStateConfig, () => {
      fetchData('genres')
        .then((data) => genres.value = data || [])
    })

    onMounted(() => {
      fetchData('genres')
        .then((data) => genres.value = data || [])
    })

    return {
      genres,
      pageHeading,
      pagePagination,
      isDataFetched,
      switchPagination
    }
  }
})
</script>
