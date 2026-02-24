<template>
  <section class="template">
    <transition name="fade">
      <Loader
        v-if="!isFetched || isRefetching"
        :mode="isMobile ? 'dark' : 'light'"
      />
    </transition>

    <transition name="fade">
      <CollectionContent
        v-if="isFetched && collection"
        :isFetched="isFetched"
        :pageEntityKey="pageEntityKey"
        :data="collection"
        :totalCounts="totalCounts"
        :setUploadedImage="refetch"
        defaultPreview="/img/album.webp"
        @saveNewPost="saveNewPost"
        @orderChanged="changeAlbumsOrder"
        @saveTitle="saveTitle"
      />
    </transition>

  </section>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { CollectionContent } from '~widgets/collection-content'
import { useGetPage, useUpdateEntity } from '~shared/model'

import { Loader } from '~shared/UI'
import { DatabaseService } from '~shared/api'
import { useLocalization, useDevice } from '~shared/model'

import type { CollectionFull } from '~entities/collection'
import type { DraggableEvent, ReorderPayload } from '~shared/lib'

const dbService = new DatabaseService()

const pageEntityKey = ref('collections')

const { isMobile } = useDevice()
const { localize } = useLocalization()
const { data: collection, isFetched, isRefetching, refetch } = useGetPage<CollectionFull>(pageEntityKey, dbService)

const collectionId = computed(() => collection.value?._id || null)

const { updateEntry, reorderEntities } = useUpdateEntity(pageEntityKey, dbService, collectionId)

const saveNewPost = (config: { payload: { albumId: string; post: string }, path: 'post' }) => {
  updateEntry(config).catch(console.error)
}

const changeAlbumsOrder = (event: DraggableEvent) => {
  const { newIndex, oldIndex } = event

  if (newIndex === oldIndex) return

  const payload: ReorderPayload = {
    newOrder: newIndex,
    oldOrder: oldIndex
  }

  reorderEntities(payload)
}

const saveTitle = (value: string) => {
  updateEntry({ payload: { title: value }, path: 'title' })
    .catch(console.error)
}

const totalCounts = computed(() => (
  localize('totalAlbums') + `: ${(collection.value?.albums?.length || 0)}`
))
</script>
