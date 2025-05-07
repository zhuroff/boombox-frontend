<template>
  <section class="template">
    <transition name="fade">
      <Preloader
        v-if="!isAlbumReady"
        mode="light"
      />
    </transition>

    <transition name="fade">
      <AlbumContent
        v-if="album"
        :relatedAlbums="relatedAlbums"
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
            v-if="'tracks' in album"
            :tracks="album.tracks"
            :albumID="album._id"
            @trackOrderChanged="changeTracksOrder"
            @removeTrackFromCompilation="removeTrackFromCompilation"
          />
        </template>

        <template #footer>
          <DiscogsTable :entity="minimumAlbumData" />
        </template>
      </AlbumContent>
    </transition>

    <Modal
      :isModalActive="isCollectionsModalEnabled"
      @closeModal="isCollectionsModalEnabled = false"
    >
      <GatheringBlock
        :albumId="album?._id"
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
import { computed, ref } from 'vue'

import { useAlbum, AlbumContent } from '~features/album'
import { useCollections } from '~features/collection'
import { DiscogsTable } from '~features/discogs'
import { WikiFrame } from '~features/wiki'

import DatabaseService from '~/services/DatabaseService'
import Preloader from '~/components/Preloader.vue'
import PageHeadAdapter from '~/components/PageHeadAdapter/PageHeadAdapter.vue'
import GatheringBlock from '~/components/Gatherings/GatheringBlock.vue'
import TrackList from '~/components/TrackList/TrackList.vue'
import Modal from '~/components/Modal.vue'

const dbService = new DatabaseService()

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

const changeTracksOrder = (payload: ReorderPayload) => {
  // emit('trackOrderChanged', payload)
}

const removeTrackFromCompilation = (payload: GatheringUpdateReq) => {
  // emit('removeTrackFromCompilation', payload)
}
</script>
