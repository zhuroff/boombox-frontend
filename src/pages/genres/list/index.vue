<template>
  <ListPageTemplate
    cardType="CardCategory"
    rootPath="genres"
    cardClass="card-category"
    placeholderImage="/img/genre.webp"
    :isDataFetched="isDataFetched"
    :pageHeading="pageHeading"
    :dataList="entities"
    :pagePagination="pagePagination"
    :switchPagination="switchPagination"
  >
    <!-- <template v-slot:header></template> -->
  </ListPageTemplate>
</template>

<script lang="ts">
import { defineComponent, onMounted, computed, watch } from 'vue'
import { CategoryItem } from '~/types/Category'
import { useListPage } from '~/hooks/useListPage'
import ListPageTemplate from '~/templates/ListPageTemplate.vue'

export default defineComponent({
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
      switchPagination
    } = useListPage<CategoryItem>()

    const pageHeading = computed(() => (
      `There are ${pagePagination.value?.totalDocs || 0} genres in collection`
    ))

    watch(pageStateConfig, () => fetchData('genres'))    
    onMounted(() => fetchData('genres'))

    return {
      pageHeading,
      entities,
      pagePagination,
      isDataFetched,
      switchPagination
    }
  }
})
</script>
