<template>
  <section class="template">
    <transition name="fade">
      <Loader
        v-if="isDiscogsCollectionLoading"
        mode="light"
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
          :renderContent="renderCollectionContent"
        />
      </section>
    </transition>
  </section>
</template>

<script setup lang="ts">
import { h, computed, ref, watchEffect } from 'vue'
import { usePaginator } from '~features/paginator'
import { Header } from '~widgets/header'
import { TabsList } from '~widgets/tabs'
import { Loader, Button } from '~shared/UI'
import { DiscogsService, useDiscogs, type DiscogsCollectionQueryConfig, type DiscogsCollectionRow } from '~features/discogs'

const discogsService = new DiscogsService()

const activeTabId = ref<number | null>(null)

const discogsCollectionQueryConfig = ref<DiscogsCollectionQueryConfig>({
  folderName: null
})

const { paginationState } = usePaginator({
  isRouted: false,
  localStorageKey: 'discogs-collection'
})

const queryConfig = computed(() => ({
  ...discogsCollectionQueryConfig.value,
  ...paginationState.value
}))

const {
  getDiscogsCollection,
  isDiscogsCollectionLoading,
  discogsCollection
} = useDiscogs(discogsService)

const renderCollectionTitle = (item: DiscogsCollectionRow) => (
  h(
    Button,
    {
      label: `${item.name}: ${item.count}`,
      isText: true,
      onClick: () => activeTabId.value = item.id
    }
  )
)

const renderCollectionContent = (item: DiscogsCollectionRow) => h('div', {}, [
  h('p', item.count)
])

watchEffect(() => {
  getDiscogsCollection(queryConfig.value)
    .then((data) => {
      activeTabId.value = data[0].id
    })
})
</script>

<style lang="scss" scoped>
@use '~/app/styles/variables' as var;

.content {
  padding-left: var.$mainPadding;
}
</style>
