<template>
  <section class="template">
    <transition name="fade">
      <Preloader
        v-if="!isAlbumReady"
        mode="light"
      />
    </transition>
    <transition name="fade">
      <div v-if="album" class="album">
        <PageHeadAdapter
          :album="album"
          @getRandomAlbum="() => preRandomState = album?._id || ''"
          @addToCollection="isCollectionsModalEnabled = true"
          @getWikiInfo="isWikiFrameEnabled = true"
        />
        <div class="album__content">
          <div
            class="album__main"
            ref="albumContent"
          >
            <TrackList
              v-if="'tracks' in album"
              :tracks="album.tracks"
              :albumID="album._id"
              @trackOrderChanged="changeTracksOrder"
              @removeTrackFromCompilation="removeTrackFromCompilation"
            />
          </div>
          <div
            v-for="{ name, docs } in relatedAlbums"
            class="album__related"
          >
            <div class="album__related-title">
              {{ localize('moreOf') }} {{ name }}
            </div>
            <EntityCards
              :entities="docs"
              :entityKey="'albums'"
              :isDraggable="false"
              :isDeletable="false"
              template="col"
              placeholderPreview="/img/album.webp"
            />
          </div>
        </div>
      </div>
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
      <WikiFrame
        :frameURL="wikiFrameURL"
        :isLoading="isWikiSearching || isWikiPageLoading"
        :searchResults="wikiSearchResults?.results"
        @selectWikiResult="(wikiID) => wikiPageID = String(wikiID)"
      />
    </Modal>
  </section>
</template>

<script setup lang="ts">
import useAlbum from './useAlbum'
import useWiki from './useWiki'
import useCollections from './useCollections'
import useGlobalStore from '~/store/global'
import DatabaseService from '~/services/DatabaseService'
import Preloader from '~/components/Preloader.vue'
import PageHeadAdapter from '~/components/PageHeadAdapter/PageHeadAdapter.vue'
import GatheringBlock from '~/components/Gatherings/GatheringBlock.vue'
import TrackList from '~/components/TrackList/TrackList.vue'
import EntityCards from '~/components/EntityCards.vue'
import WikiFrame from '~/components/WikiFrame.vue'
import Modal from '~/components/Modal.vue'

const dbService = new DatabaseService()

const { globalGetters: { localize } } = useGlobalStore()

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

const {
  isWikiSearching,
  isWikiPageLoading,
  isWikiFrameEnabled,
  wikiSearchResults,
  wikiFrameURL,
  wikiPageID
} = useWiki(album)

const changeTracksOrder = (payload: ReorderPayload) => {
  // emit('trackOrderChanged', payload)
}

const removeTrackFromCompilation = (payload: GatheringUpdateReq) => {
  // emit('removeTrackFromCompilation', payload)
}
</script>
