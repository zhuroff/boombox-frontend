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
      <Gathering
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

import { useAlbum, AlbumContent } from '~widgets/album-content'
import { PageHeadAdapter } from '~widgets/page-heads'
import { Gathering } from '~widgets/gathering'

import { useCollections } from '~features/collection'
import { DiscogsTable } from '~features/discogs'
import { WikiFrame } from '~features/wiki'

import { Modal, Loader } from '~shared/UI'
import { DatabaseService } from '~shared/api'

import TrackList from '~/components/TrackList/TrackList.vue'

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
