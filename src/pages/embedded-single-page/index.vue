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
      <Confirmation
        :message="localize('delConfirmMessage')"
        @confirm="isDeleteConfirmed = true"
        @reject="isDeleteModalEnabled = false"
      >
        <Loader
          v-if="isAlbumDeleting"
          mode="light"
        />
      </Confirmation>
    </Modal>
  </section>
</template>

<script setup lang="ts">
import { computed, watch, ref } from 'vue'
import { useRouter } from 'vue-router'

import { AlbumContent } from '~widgets/album-content'
import { PageHeadAdapter } from '~widgets/page-heads'

import { WikiFrame } from '~usecases/wiki'
import { DiscogsTable } from '~usecases/discogs'

import { useAlbum } from '~entities/album'

import { Modal, Loader, Confirmation } from '~shared/UI'
import { useDeleteEntity, useSnackbar } from '~shared/model'
import { DatabaseService } from '~shared/api'

import { useTranslate } from '~usecases/localization'

const dbService = new DatabaseService()

const entityKey = ref('embedded')
const isWikiFrameEnabled = ref(false)
const isDeleteModalEnabled = ref(false)
const isDeleteConfirmed = ref(false)
const router = useRouter()

const { localize } = useTranslate()
const { setSnackbarMessage } = useSnackbar()

const {
  album,
  isAlbumReady,
  preRandomState,
  relatedAlbums
} = useAlbum(dbService, entityKey)

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
