<template>
  <div class="template">
    <transition name="fade">
      <Preloader
        v-if="!isFetched"
        mode="light"
      />
    </transition>
    <transition-group name="flyUp">
      <Header
        v-if="pageHeadingKey"
        key="header"
        :heading="localize(pageHeadingKey, docsCount)"
        :withSearch="!!withSearch"
      >
        <slot name="header"></slot>
        <slot name="under-header"></slot>
      </Header>
      <section
        class="content"
        key="content"
      >
        <EntityCards
          v-if="data?.docs"
          :entities="data?.docs"
          :entityKey="entityKey"
          :isDraggable="isDraggable"
          :isDeletable="isDeletable"
          :placeholderPreview="placeholderPreview"
          @deleteEntity="confirmDelete"
        />
        <Paginator
          v-if="paginationConfig?.totalPages > 1"
          key="pagination"
          :config="paginationConfig"
          :pagination="pagination"
          :style="{ marginTop: 'auto' }"
          :updatePaginationState="updatePaginationState"
        />
      </section>
    </transition-group>
    <Modal
      v-if="isDeletable && deletePayload"
      :isModalActive="deletePayload !== null"
      @closeModal="deletePayload = null"
    >
      <Confirmation
        :message="localize('delConfirmMessage')"
        @confirm="deleteConfirm"
        @reject="deletePayload = null"
      >
        <Preloader
          v-if="deletePayload.isPending"
          mode="light"
        />
      </Confirmation>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watchEffect } from 'vue'
import useGlobalStore from '~/store/global'
import useGetList from '~/shared/useGetList'
import usePagination from '~/hooks/usePagination'
import useSnackbar from '~/hooks/useSnackbar'
import Preloader from '~/components/Preloader.vue'
import Header from '~/components/Header.vue'
import EntityCards from '~/components/Cards/EntityCards.vue'
import Paginator from '~/components/Paginator.vue'
import Modal from '~/components/Modal.vue'
import Confirmation from '~/components/Confirmation.vue'
import DatabaseService from '~/services/DatabaseService'

interface Props {
  entityKey: string
  placeholderPreview: string
  pageHeadingKey?: string
  isDraggable?: boolean 
  isDeletable?: boolean
  withSearch?: boolean
}

const props = defineProps<Props>()

const { pagination, paginationConfig, updatePaginationConfig, updatePaginationState } = usePagination({})

const dbService = new DatabaseService()

const listQueryConfig = computed(() => ({
  entityKey: props.entityKey,
  requestConfig: pagination
}))

const { data, refetch, isFetched } = useGetList<BasicEntity>(listQueryConfig, dbService)
const { globalGetters: { localize } } = useGlobalStore()
const { setSnackbarMessage } = useSnackbar()

const deletePayload = ref<DeletePayload | null>(null)

const docsCount = computed(() => String(data.value?.pagination.totalDocs || 0))

const confirmDelete = (payload: DeletePayload) => {
  deletePayload.value = payload
}

const deleteConfirm = () => {
  if (!deletePayload.value) return

  deletePayload.value.isPending = true
}

watchEffect(() => {
  if (isFetched.value) {
    updatePaginationConfig('totalDocs', data.value?.pagination.totalDocs || 0)
    updatePaginationConfig('totalPages', data.value?.pagination.totalPages || 0)
  }
})
</script>
