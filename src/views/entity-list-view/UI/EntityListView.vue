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
      <Confirmation :message="localize('delConfirmMessage')">
        <template #actions>
          <Button
            :label="localize('delete')"
            @click="deleteEntity"
          />
          <Button
            :label="localize('cancel')"
            @click="deletedEntityId = null"
          />
        </template>
        <template #loader>
          <Loader
            v-if="isDeleting"
            mode="light"
          />
        </template>
      </Confirmation>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watchEffect, watch } from 'vue'

import { Header } from '~widgets/header'
import { EntityCardList, type UnifiedEntityCard } from '~widgets/entity-cards'

import { DatabaseService } from '~shared/api'
import { Modal, Loader, Confirmation, Button, Paginator } from '~shared/UI'
import { useLocalization, useGetList, useDeleteEntity, usePaginator } from '~shared/model'
import type { DeletePayload } from '~shared/lib'
import { DEFAULT_PAGE_DOCS_LIMIT } from '~shared/constants'

type Props = {
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

const { localize } = useLocalization()

const deletedEntityId = ref<string | null>(null)

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

const { data, refetch, isFetched, isFetching } = useGetList<UnifiedEntityCard>(listQueryConfig, dbService)

const {
  deletedEntity,
  deleteEntity,
  isDeleting
} = useDeleteEntity<UnifiedEntityCard>(
  props.entityKey,
  deletedEntityId,
  dbService,
)

const docsCount = computed(() => String(data.value?.pagination.totalDocs || 0))

const isPaginated = computed(() => (
  isFetched.value && Number(data.value?.pagination.totalPages) > 1
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
    if (value) refetch()
  }
)

watch(
  deletedEntity,
  (value) => {
    if (value) {
      deletedEntityId.value = null
      refetch()
    }
  }
)
</script>
