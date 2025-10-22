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

import { Modal, Loader } from '~shared/UI'
import { DatabaseService } from '~shared/api'
import { useDevice } from '~shared/model'

const dbService = new DatabaseService()

const { isMobile } = useDevice()
const { initPlaylist, changePlaylistOrder } = usePlaylistService()

const {
  album,
  isAlbumReady,
  preRandomState,
  relatedAlbums
} = useAlbum(dbService)

const {
  collections,
  selectCollection,
  createCollection,
  isGatheringFetching,
  isCollectionsModalEnabled
} = useCollections(album, dbService)

const isWikiFrameEnabled = ref(false)

const minimumAlbumData = computed(() => ({
  albumTitle: album.value?.title || '',
  albumArtist: album.value?.artist?.title || ''
}))

watch(
  [isAlbumReady, album],
  ([isAlbumReady, album]) => {
    isAlbumReady && album && initPlaylist(album)
  }
)
</script>
