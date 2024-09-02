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
          :message="localize('delConfirmMessage')"
          @confirm="deleteCompilation"
          @reject="delReject"
        />
      </Modal>
    </template>
  </ListPageTemplate>
</template>

<script setup lang="ts">
import { computed, ref, watch, reactive } from 'vue'
import { useListPage } from '~/hooks/useListPage'
import useGlobalStore from '~/store/global'
import type { CompilationEntityRes } from '~/types/ReqRes'
import type { BasicEntity } from '~/types/Common'
import { isObjectsEquals } from '~/utils'
import CompilationItem from '~/classes/CompilationItem'
import ListPageTemplate from '~/templates/ListPageTemplate.vue'
import Confirmation from '~/components/Confirmation.vue'
import Modal from '~/components/Modal.vue'

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

const {
  globalGetters: { localize }
} = useGlobalStore()

const compilations = reactive<CompilationItem<BasicEntity>[]>([])
const entityToDelete = ref<string | null>(null)

const pageHeading = computed(() => (
  localize(`headings.compilationsPage`, String(pagePagination.value?.totalDocs || 0))
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
        .then((data) => {
          compilations.splice(0, compilations.length, ...data || [])
        })
    }
  },
  { immediate: true }
)
</script>
