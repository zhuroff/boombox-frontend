<template>
  <ListPageTemplate
    placeholderImage="/img/album.webp"
    :isDataFetched="isDataFetched"
    :pageHeading="pageHeading"
    :dataList="compilations"
    :pagePagination="pagePagination"
    :switchPagination="switchPagination"
    :setEntitiesLimit="setEntitiesLimit"
    @deleteEntity="(id) => entityToDelete = id"
  >
    <template #modal>
      <Modal
        v-if="entityToDelete"
        :isModalActive="entityToDelete !== null"
        @closeModal="delReject"
      >
        <Confirmation
          :message="lang('delConfirmMessage')"
          @confirm="deleteCompilation"
          @reject="delReject"
        />
      </Modal>
    </template>
  </ListPageTemplate>
</template>

<script lang="ts">
import { defineComponent, computed, ref, watch, reactive } from 'vue'
import { useListPage } from '~/hooks/useListPage'
import { useLocales } from '~/hooks/useLocales'
import { CompilationEntityRes } from '~/types/ReqRes'
import { BasicEntity } from '~/types/Common'
import { isObjectsEquals } from '~/utils'
import CompilationItem from '~/classes/CompilationItem'
import ListPageTemplate from '~/templates/ListPageTemplate.vue'
import Confirmation from '~/components/Confirmation.vue'
import Modal from '~/components/Modal.vue'

export default defineComponent({
  name: 'CompilationsList',
  components: {
    ListPageTemplate,
    Confirmation,
    Modal
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
    const compilations = reactive<CompilationItem<BasicEntity>[]>([])
    const entityToDelete = ref<string | null>(null)

    const pageHeading = computed(() => (
      lang(`headings.compilationsPage`, pagePagination.value?.totalDocs || 0)
    ))

    const deleteCompilation = () => {
      if (!entityToDelete.value) return false
      deleteEntity('compilations', entityToDelete.value)
        .then(() => {
          entityToDelete.value = null
          fetchData('compilations')
            .then((payload) => {
              compilations.splice(0, compilations.length, ...payload || [])
            })
        })
    }

    const delReject = () => {
      entityToDelete.value = null
    }

    watch(
      pageStateConfig,
      (newVal, oldVal) => {
        if (!isObjectsEquals(newVal, oldVal)) {
          fetchData('compilations')
            .then((payload) => {
              compilations.splice(0, compilations.length, ...payload || [])
            })
        }
      },
      { immediate: true }
    )

    return {
      lang,
      delReject,
      entityToDelete,
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