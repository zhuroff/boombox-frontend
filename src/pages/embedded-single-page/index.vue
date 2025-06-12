<template>
  <section class="template">
    <transition name="fade">
      <Loader
        v-if="!isAlbumReady"
        mode="light"
      />
    </transition>

    <transition name="fade">
      <AlbumContent
        v-if="album"
        :relatedAlbums="relatedAlbums"
        entityKey="albums"
        cardsTemplate="row"
      >
        <template #hero>
          <PageHeadAdapter
            :album="album"
            @getRandomAlbum="() => preRandomState = album?._id || ''"
            @getWikiInfo="isWikiFrameEnabled = true"
            @deleteAlbum="isDeleteModalEnabled = true"
          />
        </template>

        <template #footer>
          <DiscogsTable :entity="minimumAlbumData" />
        </template>
      </AlbumContent>
    </transition>

    <Modal
      :isModalActive="isWikiFrameEnabled"
      @closeModal="isWikiFrameEnabled = false"
    >
      <WikiFrame :entity="minimumAlbumData" />
    </Modal>

    <Modal
      :isModalActive="isDeleteModalEnabled"
      @closeModal="isDeleteModalEnabled = false"
    >
      <Confirmation :message="localize('delConfirmMessage')">
        <template #actions>
          <Button
            :label="localize('delete')"
            @click="isDeleteConfirmed = true"
          />
          <Button
            :label="localize('cancel')"
            @click="isDeleteModalEnabled = false"
          />
        </template>
        <template #loader>
          <Loader
            v-if="isAlbumDeleting"
            mode="light"
          />
        </template>
      </Confirmation>
    </Modal>
  </section>
</template>

<script setup lang="ts">
import { computed, watch, ref } from 'vue'
import { useRouter } from 'vue-router'

import { AlbumContent } from '~widgets/album-content'
import { PageHeadAdapter } from '~widgets/page-heads'
import { DiscogsTable } from '~widgets/discogs'

import { WikiFrame } from '~features/wiki'

import { useEmbedded } from '~entities/embedded'

import { Modal, Loader, Button, Confirmation } from '~shared/UI'
import { useDeleteEntity, useSnackbar, useLocalization } from '~shared/model'
import { DatabaseService } from '~shared/api'

const dbService = new DatabaseService()

const entityKey = ref('embedded')
const isWikiFrameEnabled = ref(false)
const isDeleteModalEnabled = ref(false)
const isDeleteConfirmed = ref(false)
const router = useRouter()

const { localize } = useLocalization()
const { setSnackbarMessage } = useSnackbar()

const {
  album,
  isAlbumReady,
  preRandomState,
  relatedAlbums
} = useEmbedded(dbService)

const minimumAlbumData = computed(() => ({
  albumTitle: album.value?.title || '',
  albumArtist: album.value?.artist?.title || ''
}))

const currentAlbumId = computed(() => album.value?._id || null)

const {
  isFetched: isAlbumDeleted,
  isFetching: isAlbumDeleting
} = useDeleteEntity(entityKey, currentAlbumId, dbService, isDeleteConfirmed)

watch(
  () => isAlbumDeleted.value,
  (isDeleted) => {
    if (isDeleted) {
      setSnackbarMessage({
        message: localize('deletedEmbeddedMessage'),
        type: 'success'
      })
      router.push('/embedded')
    }
  }
)
</script>
