<template>
  <section class="template">
    <transition name="fade">
      <Loader
        v-if="!isFetched || isRefetching"
        mode="light"
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
        @excludeAlbum="(payload) => {
          excludeGenerator = excludeAlbum(payload)
          excludeGenerator.next()
        }"
        @saveTitle="saveTitle"
      />
    </transition>

    <Modal
      :isModalActive="isConfirmActive"
      @closeModal="isConfirmActive = false"
    >
      <Confirmation :message="localize('delConfirmMessage')">
        <template #actions>
          <Button
            :label="localize('delete')"
            @click="() => {
              excludeGenerator?.next()
            }"
          />
          <Button
            :label="localize('cancel')"
            @click="() => {
              isConfirmActive = false
              excludeGenerator = null
            }"
          />
        </template>
      </Confirmation>
    </Modal>
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { CollectionContent } from '~widgets/collection-content'
import { useGetPage, useSnackbar, useUpdateEntity } from '~shared/model'

import { Loader, Modal, Button, Confirmation } from '~shared/UI'
import { DatabaseService } from '~shared/api'
import { useLocalization } from '~shared/model'

import type { CollectionFull } from '~entities/collection'
import type { DraggableEvent, ReorderPayload } from '~shared/lib'

function* excludeAlbum(payload: { albumId: string; collectionId: string }) {
  yield (() => {
    isConfirmActive.value = true
  })()
  yield (() => {
    updateEntity({
      isInList: true,
      gatheringID: collectionId.value,
      entityType: 'collections',
      entityID: payload.albumId
    })
    .then(() => {
      isConfirmActive.value = false
      excludeGenerator.value = null
      setSnackbarMessage({
        message: localize('snackbars.delete.success'),
        type: 'success'
      })
      refetch()
    })
  })()
}

const dbService = new DatabaseService()

const pageEntityKey = ref('collections')
const isConfirmActive = ref(false)
const excludeGenerator = ref<ReturnType<typeof excludeAlbum> | null>(null)

const { localize } = useLocalization()
const { setSnackbarMessage } = useSnackbar()
const { data: collection, isFetched, isRefetching, refetch } = useGetPage<CollectionFull>(pageEntityKey, dbService)

const collectionId = computed(() => collection.value?._id || null)

const { updateEntry, updateEntity, reorderEntities } = useUpdateEntity(pageEntityKey, dbService, collectionId)

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
