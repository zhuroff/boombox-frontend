<template>
  <div class="template">
    <transition name="fade">
      <Loader
        v-if="!isFetched || isFetching"
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
        <EntityCardList
          v-if="data?.docs"
          :entities="data.docs"
          :entityKey="entityKey"
          :isDraggable="isDraggable"
          :isDeletable="isDeletable"
          :placeholderPreview="placeholderPreview"
          @deleteEntity="(payload: DeletePayload) => deletedEntityId = payload.id"
        />
        <Paginator
          v-if="isPaginated"
          :paginationState="paginationState"
          :paginationConfig="paginationConfig"
          :updatePaginationState="updatePaginationState"
        />
      </section>
    </transition-group>
    <Modal
      :isModalActive="!!isDeletable && !!deletedEntityId"
      @closeModal="deletedEntityId = null"
    >
      <Confirmation
        :message="localize('delConfirmMessage')"
        @confirm="isDeleteConfirmed = true"
        @reject="deletedEntityId = null"
      >
        <Loader
          v-if="isDeleting"
          mode="light"
        />
      </Confirmation>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watchEffect, watch } from 'vue'
import { Header } from '~widgets/header'
import { Paginator, usePaginator } from '~widgets/paginator'
import { EntityCardList } from '~features/cardlist'
import { Modal, Loader, Confirmation } from '~shared/UI'
import { DatabaseService } from '~shared/api'
import { useGetList, useDeleteEntity } from '~shared/model'
import { DEFAULT_PAGE_DOCS_LIMIT } from '~shared/constants'
import type { Entity, DeletePayload } from '~shared/lib'

import { useTranslate } from '~features/localization'

interface Props {
  entityKey: string
  placeholderPreview: string
  pageHeadingKey?: string
  isDraggable?: boolean 
  isDeletable?: boolean
  withSearch?: boolean
  isRefresh?: boolean
}

const props = defineProps<Props>()
const dbService = new DatabaseService()

const { localize } = useTranslate()

const deletedEntityId = ref<string | null>(null)
const isDeleteConfirmed = ref(false)

const docsLimit = ref((() => {
  const cachedDocsLimit = localStorage.getItem(`docs-limit:${props.entityKey}`)

  if (cachedDocsLimit) {
    return Number(cachedDocsLimit)
  } else {
    localStorage.setItem(`docs-limit:${props.entityKey}`, String(DEFAULT_PAGE_DOCS_LIMIT))
    return DEFAULT_PAGE_DOCS_LIMIT
  }
})())

const {
  paginationState,
  paginationConfig,
  updatePaginationState,
  updatePaginationConfig
} = usePaginator({
  docsLimit: docsLimit.value,
  localStorageKey: `docs-limit:${props.entityKey}`
})

const listQueryConfig = computed(() => ({
  entityKey: props.entityKey,
  requestConfig: paginationState
}))

const { data, refetch, isFetched, isFetching } = useGetList<Entity>(listQueryConfig, dbService)
const {
  isFetched: isDeleted,
  isFetching: isDeleting
} = useDeleteEntity<Entity>(
  props.entityKey,
  deletedEntityId,
  dbService,
  isDeleteConfirmed
)

const docsCount = computed(() => String(data.value?.pagination.totalDocs || 0))

const isPaginated = computed(() => (
  isFetched.value && data.value?.pagination.totalPages > 1
))

watchEffect(() => {
  if (isFetched.value) {
    updatePaginationConfig('totalDocs', data.value?.pagination.totalDocs || 0)
    updatePaginationConfig('totalPages', data.value?.pagination.totalPages || 0)
  }
})

watch(
  () => props.isRefresh,
  (value) => {
    if (value) {
      refetch()
    }
  }
)

watch(
  () => isDeleted.value,
  (value) => {
    if (value) {
      deletedEntityId.value = null
      isDeleteConfirmed.value = false
    }
  }
)
</script>
