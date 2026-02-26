<template>
  <section class="template">
    <transition name="fade">
      <Loader
        v-if="isDiscogsCollectionLoading"
        :mode="isMobile ? 'dark' : 'light'"
      />
    </transition>
    <Header
      heading="Physical Collection"
      :withSearch="true"
    >
      <slot name="header"></slot>
    </Header>
    <transition name="flyUp">
      <section
        class="content"
        v-if="!isDiscogsCollectionLoading && discogsCollection.length > 0"
      >
        <TabsList
          :items="discogsCollection"
          :activeTabId="activeTabId"
          :renderTitle="renderCollectionTitle"
          :renderContent="renderCollection"
        >
          <template #footer>
            <Paginator
              :paginationState="paginationState"
              :paginationConfig="paginationConfig"
              :updatePaginationState="updatePaginationState"
            />
          </template>
        </TabsList>
      </section>
    </transition>
  </section>
</template>

<script setup lang="ts">
import { h, computed, ref, watch } from 'vue'
import { Paginator, usePaginator } from '~features/paginator'
import { Header } from '~widgets/header'
import { TabsList } from '~widgets/tabs'
import { Loader, Button } from '~shared/UI'
import { useDevice } from '~shared/model'
import { DiscogsService, useDiscogs, type DiscogsCollectionRow } from '~features/discogs'
import { renderCollection } from './renderCollection'

const discogsService = new DiscogsService()

const { isMobile } = useDevice()

const activeTabId = ref<number | null>(null)
const discogsCollection = ref<DiscogsCollectionRow[]>([])

const {
  paginationState,
  paginationConfig,
  updatePaginationState,
  updatePaginationConfig
} = usePaginator({
  isRouted: false,
  docsSort: ref({ date_added: -1 }),
  localStorageKey: 'discogs-collection'
})

const {
  getDiscogsCollection,
  isDiscogsCollectionLoading
} = useDiscogs(discogsService)

const discogsCollectionQueryConfig = computed(() => ({
  folderName: activeTabId.value
    ? discogsCollection.value.find((col) => col.id === activeTabId.value)?.name || null
    : null
}))

const renderCollectionTitle = (item: DiscogsCollectionRow) => (
  h(
    Button,
    {
      label: `${item.name}: ${item.count}`,
      isText: true,
      onClick: () => {
        activeTabId.value = item.id
        paginationState.value.page = 1
      }
    }
  )
)

const activeCollection = computed(() => {
  return discogsCollection.value.find(col => col.id === activeTabId.value)
})

watch(
  paginationState.value,
  (value) => {
    getDiscogsCollection({
      ...discogsCollectionQueryConfig.value,
      ...value
    })
      .then((data) => {
        if (!activeTabId.value) {
          activeTabId.value = data[0].id
          discogsCollection.value = data
        } else {
          const currentCollection = data[0]
          discogsCollection.value = discogsCollection.value.map((folder) => (
            folder.id === currentCollection.id ? currentCollection : folder
          ))
        }
      })
  },
  { immediate: true }
)

watch(
  activeCollection,
  (collection) => {
    if (collection?.pagination) {
      updatePaginationConfig('totalDocs', collection.pagination.items)
      updatePaginationConfig('totalPages', collection.pagination.pages)
    }
  }
)
</script>

<style lang="scss" scoped>
@use '~/app/styles/variables' as var;
@use './renderCollection.scss' as collection;

.content {
  padding-left: var.$mainPadding;
}

:deep(.tabview__content) {
  @include collection.collection-styles;
}
</style>
