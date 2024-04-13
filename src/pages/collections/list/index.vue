<template>
  <ListPageTemplate
    placeholderImage="/img/album.webp"
    :isDataFetched="isDataFetched"
    :pageHeading="pageHeading"
    :dataList="collections"
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
          @confirm="deleteCollection"
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
import { CollectionEntityRes } from '~/types/ReqRes'
import { BasicEntity } from '~/types/Common'
import { isObjectsEquals } from '~/utils'
import CollectionEntity from '~/classes/CollectionEntity'
import ListPageTemplate from '~/templates/ListPageTemplate.vue'
import Confirmation from '~/components/Confirmation.vue'
import Modal from '~/components/Modal.vue'

export default defineComponent({
  name: 'CollectionsList',
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
      CollectionEntityRes<BasicEntity>,
      CollectionEntity<BasicEntity>
    >(CollectionEntity, 'CollectionCard', 'collections')

    const { lang } = useLocales()
    const collections = reactive<CollectionEntity<BasicEntity>[]>([])
    const entityToDelete = ref<string | null>(null)

    const pageHeading = computed(() => (
      lang(`headings.collectionsPage`, pagePagination.value?.totalDocs || 0)
    ))

    const deleteCollection = () => {
      if (!entityToDelete.value) return false
      deleteEntity('collections', entityToDelete.value)
        .then(() => {
          entityToDelete.value = null
          fetchData('collections')
            .then((payload) => {
              collections.splice(0, collections.length, ...payload || [])
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
          fetchData('collections')
            .then((payload) => {
              collections.splice(0, collections.length, ...payload || [])
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
      deleteCollection,
      pageHeading,
      collections
    }
  }
})
</script>
