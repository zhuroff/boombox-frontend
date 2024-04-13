<template>
  <ListPageTemplate
    placeholderImage="/img/period.webp"
    :isDataFetched="isDataFetched"
    :pageHeading="pageHeading"
    :dataList="periods"
    :pagePagination="pagePagination"
    :switchPagination="switchPagination"
    :setEntitiesLimit="setEntitiesLimit"
  />
</template>

<script lang="ts">
import { defineComponent, onMounted, computed, watch, reactive } from 'vue'
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
    } = useListPage<CategoryItemRes, CategoryItem>(CategoryItem, 'CategoryCard', 'periods')

    const periods = reactive<CategoryItem[]>([])

    const pageHeading = computed(() => (
      `There are ${pagePagination.value?.totalDocs || 0} periods in collection`
    ))

    watch(pageStateConfig, () => {
      fetchData('periods')
        .then((data) => {
          periods.splice(0, periods.length, ...data || [])
        })
    })

    onMounted(() => {
      fetchData('periods')
        .then((data) => {
          periods.splice(0, periods.length, ...data || [])
        })
    })

    return {
      periods,
      pageHeading,
      pagePagination,
      isDataFetched,
      switchPagination,
      setEntitiesLimit
    }
  }
})
</script>
