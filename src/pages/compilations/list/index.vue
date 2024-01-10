<template>
  <ListPageTemplate
    placeholderImage="/img/album.webp"
    :isDataFetched="isDataFetched"
    :pageHeading="pageHeading"
    :dataList="compilations"
    :pagePagination="pagePagination"
    :switchPagination="switchPagination"
    :setEntitiesLimit="setEntitiesLimit"
    @deleteEntity="deleteCompilation"
  />
</template>

<script lang="ts">
import { defineComponent, computed, ref, watch } from 'vue'
import { useListPage } from '~/hooks/useListPage'
import { useLocales } from '~/hooks/useLocales'
import { CompilationEntityRes } from '~/types/ReqRes'
import { BasicEntity } from '~/types/Common'
import { isObjectsEquals } from '~/utils'
import CompilationItem from '~/classes/CompilationItem'
import ListPageTemplate from '~/templates/ListPageTemplate.vue'

export default defineComponent({
  name: 'CompilationsList',
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
      CompilationEntityRes<BasicEntity>,
      CompilationItem<BasicEntity>
    >(CompilationItem, 'CompilationCard', 'compilations')

    const { lang } = useLocales()
    const compilations = ref<CompilationItem<BasicEntity>[]>([])

    const pageHeading = computed(() => (
      lang(`headings.compilationsPage`, pagePagination.value?.totalDocs || 0)
    ))

    const deleteCompilation = (id: string) => {
      deleteEntity('compilations', id)
        .then(() => {
          fetchData('compilations')
            .then((payload) => compilations.value = payload || [])
        })
    }

    watch(
      pageStateConfig,
      (newVal, oldVal) => {
        if (!isObjectsEquals(newVal, oldVal)) {
          fetchData('compilations')
            .then((payload) => compilations.value = payload || [])
        }
      },
      { immediate: true }
    )

    return {
      isDataFetched,
      pagePagination,
      switchPagination,
      setEntitiesLimit,
      deleteCompilation,
      pageHeading,
      compilations
    }
  }
})
</script>
~/classes/CompilationItem