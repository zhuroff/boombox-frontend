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
          <Table
            :tableState="discogsTableState"
            :tableFilters="discogsFilters"
            :tableFiltersState="discogsFiltersState"
            localeRootKey="discogsTable"
            @updateFilterValue="(value) => setDiscogsFilterValue(value)"
          />
        </template>
        <!-- <Table
          :tableState="discogsTableState"
          :tableFilters="discogsFilters"
          :tableFiltersState="discogsFiltersState"
          localeKey="discogsTable"
          @switchPagination="() => console.log('switchPagination')"
          @update:filter="() => console.log('updateDiscogsFilter')"
        /> -->
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
import useDiscogs from './useDiscogs'
import useCollections from './useCollections'
import DatabaseService from '~/services/DatabaseService'
import DiscogsService from '~/services/DiscogsService'
import Preloader from '~/components/Preloader.vue'
import AlbumContent from '~/components/Album/AlbumContent.vue'
import PageHeadAdapter from '~/components/PageHeadAdapter/PageHeadAdapter.vue'
import GatheringBlock from '~/components/Gatherings/GatheringBlock.vue'
import TrackList from '~/components/TrackList/TrackList.vue'
import Table from '~/components/Table/Table.vue'
import WikiFrame from '~/components/WikiFrame.vue'
import Modal from '~/components/Modal.vue'

const dbService = new DatabaseService()
const discogsService = new DiscogsService()

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
  discogsTableState,
  discogsFiltersState,
  setDiscogsFilterValue,
  discogsFilters
} = useDiscogs(discogsService, album)

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
