<template>
  <ListPageTemplate
    cardType="CardCategory"
    rootPath="periods"
    cardClass="card-category"
    placeholderImage="/img/period.webp"
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
      `There are ${pagePagination.value?.totalDocs || 0} periods in collection`
    ))

    watch(pageStateConfig, () => fetchData('periods'))    
    onMounted(() => fetchData('periods'))

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
