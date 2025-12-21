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
        :relatedAlbums="!isMobile ? relatedAlbums : []"
        entityKey="albums"
      >
        <template #hero>
          <PageHeadAdapter
            :album="album"
            @getRandomAlbum="() => preRandomState = album?._id || ''"
            @addToCollection="isCollectionsModalEnabled = true"
            @getWikiInfo="isWikiFrameEnabled = true"
          />
        </template>

        <template #content>
          <TrackList
            :tracks="album.tracks"
            @trackOrderChanged="changePlaylistOrder"
          />
        </template>

        <template #note>
          <div class="album__note">
            <TextareaInput
              name="albumNote"
              type="textarea"
              v-model="albumNote"
              :readonly="!isNoteEditable"
              :placeholder="localize('albumNotePlaceholder')"
              @dblclick="isNoteEditable = true"
              @blur="isNoteEditable = false"
              @onInput="changeAlbumNote"
            />
          </div>
        </template>

        <template v-if="!isMobile" #footer>
          <DiscogsTable :entity="minimumAlbumData" />
        </template>
      </AlbumContent>
    </transition>

    <Modal
      :isModalActive="isCollectionsModalEnabled"
      @closeModal="isCollectionsModalEnabled = false"
    >
      <Gathering
        :entityID="album?._id || ''"
        :isFetching="isGatheringFetching"
        :gatherings="collections"
        inputPlaceholder="collections.namePlaceholder"
        placeholderImage="/img/album.webp"
        @onSelectGathering="selectCollection"
        @onCreateGathering="createCollection"
      />
    </Modal>
    <Modal
      :isModalActive="isWikiFrameEnabled"
      @closeModal="isWikiFrameEnabled = false"
    >
      <WikiFrame :entity="minimumAlbumData" />
    </Modal>
  </section>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'

import { AlbumContent } from '~widgets/album-content'
import { PageHeadAdapter } from '~widgets/page-heads'
import { DiscogsTable } from '~widgets/discogs'
import { Gathering } from '~widgets/gathering'
import { TrackList } from '~widgets/tracklist'

import { useCollections } from '~features/collection'
import { usePlaylistService } from '~features/player'
import { WikiFrame } from '~features/wiki'

import { useAlbum } from '~entities/album'

import { Modal, Loader, TextareaInput } from '~shared/UI'
import { DatabaseService } from '~shared/api'
import { useDevice, useLocalization } from '~shared/model'
import { debounce } from '~shared/utils'

const dbService = new DatabaseService()

const { isMobile } = useDevice()
const { localize } = useLocalization()
const { initPlaylist, changePlaylistOrder } = usePlaylistService()

const {
  album,
  isAlbumReady,
  preRandomState,
  updateAlbumNote,
  relatedAlbums
} = useAlbum(dbService)

const {
  collections,
  selectCollection,
  createCollection,
  isGatheringFetching,
  isCollectionsModalEnabled
} = useCollections(album, dbService)

const albumNote = ref('')
const isNoteEditable = ref(false)
const isWikiFrameEnabled = ref(false)

const minimumAlbumData = computed(() => ({
  albumTitle: album.value?.title || '',
  albumArtist: album.value?.artist?.title || ''
}))

const changeAlbumNote = debounce((value: string) => {
  album.value?._id && updateAlbumNote([album.value._id, value])
}, 1000)

watch(
  [isAlbumReady, album],
  ([isAlbumReady, album]) => {
    isAlbumReady && album && initPlaylist(album)
    albumNote.value = album?.note || ''
  }
)
</script>
