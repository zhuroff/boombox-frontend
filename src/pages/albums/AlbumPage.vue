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
          @getRandomAlbum="getRandomAlbum"
          @addToCollection="isCollectionsModalEnabled = true"
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
              @deleteEntity="confirmDelete"
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
  </section>
</template>

<script setup lang="ts">
import { computed, onUnmounted, ref, watch } from 'vue'
import useGlobalStore from '~/store/global'
import useGetPage from '~/shared/useGetPage'
import useGetList from '~/shared/useGetList'
import useCreateEntity from '~/shared/useCreateEntity'
import useUpdateEntity from '~/shared/useUpdateEntity'
import usePagination from '~/hooks/usePagination'
import Preloader from '~/components/Preloader.vue'
import PageHeadAdapter from '~/components/PageHeadAdapter/PageHeadAdapter.vue'
import TrackList from '~/components/TrackList/TrackList.vue'
import EntityCards from '~/components/EntityCards.vue'
import Modal from '~/components/Modal.vue'
import GatheringBlock from '~/components/Gatherings/GatheringBlock.vue'
import DatabaseService from '~/services/DatabaseService'

const { globalGetters: { localize } } = useGlobalStore()

const dbService = new DatabaseService()

const pageEntityKey = ref('albums')
const collectionEntityKey = ref('collections')
const preRandomState = ref('')
const isCollectionsModalEnabled = ref(false)
const newCollectionPayload = ref<GatheringCreateReq | null>(null)
const collectionUpdatePayload = ref<GatheringUpdateReq | null>(null)
const collections = ref<GatheringBasic[]>([])
const relatedAlbumsReqConfig: RequestConfig = {
  page: 1,
  limit: 5,
  sort: { title: 1 },
  isRandom: 1
}

const isAlbumReady = computed(() => (
  Boolean(album.value) && isAlbumFetched.value
))

const isNewCollectionQueryEnabled = computed(() => (
  !!newCollectionPayload.value
))

const isUpdateCollectionQueryEnabled = computed(() => (
  !!collectionUpdatePayload.value
))

const artistConfig = computed<UseEntityListPayload>(() => (
  album.value
    ? {
        qEntity: 'relatedAlbumsByArtist',
        entityKey: 'albums',
        requestConfig: {
          ...relatedAlbumsReqConfig,
          filter: {
            from: 'artists',
            key: 'artist._id',
            name: album.value?.artist.title,
            value: album.value?.artist._id,
            excluded: { _id: album.value?._id }
          }
        }
      }
    : {} as UseEntityListPayload
))

const genreConfig = computed<UseEntityListPayload>(() => (
  album.value
    ? {
        qEntity: 'relatedAlbumsNyGenre',
        entityKey: 'albums',
        requestConfig: {
          ...relatedAlbumsReqConfig,
          filter: {
            from: 'genres',
            key: 'genre._id',
            name: album.value.genre.title,
            value: album.value.genre._id,
            excluded: { _id: album.value._id, 'artist>_id': album.value.artist._id }
          }
        }
      }
    : {} as UseEntityListPayload
))

const {
  data: album,
  isFetched: isAlbumFetched
} = useGetPage<Album>(
  pageEntityKey,
  dbService,
  preRandomState
)

const { data: relatedAlbumsByArtist } = useGetList<Album>(artistConfig, dbService, isAlbumReady)

const { data: relatedAlbumsByGenre } = useGetList<Album>(genreConfig, dbService, isAlbumReady)

const { pagination: collectionsPagination } = usePagination({ isRouted: false })

const collectionsConfig = computed(() => ({
  pageID: album.value?._id,
  entityKey: 'collections',
  requestConfig: collectionsPagination
}))

const {
  data: initialCollections,
  isFetching: isCollectionsFetching,
} = useGetList<GatheringBasic>(
  collectionsConfig,
  dbService,
  isCollectionsModalEnabled
)

const {
  data: increasedCollections,
  isFetching: isNewCollectionCreating,
} = useCreateEntity<GatheringBasic, GatheringCreateReq>(
  collectionEntityKey,
  newCollectionPayload,
  dbService,
  isNewCollectionQueryEnabled
)

const {
  data: updatedCollections,
  isFetching: isCollectionUpdating,
} = useUpdateEntity<GatheringBasic, GatheringUpdateReq>(
  collectionEntityKey,
  collectionUpdatePayload,
  dbService,
  isUpdateCollectionQueryEnabled
)

const isGatheringFetching = computed(() => (
  isNewCollectionCreating.value || isCollectionUpdating.value || isCollectionsFetching.value
))

// setPlayerPlaylist(payload)

const getRandomAlbum = () => {
  preRandomState.value = album.value?._id || ''
}

const changeTracksOrder = (payload: ReorderPayload) => {
  // emit('trackOrderChanged', payload)
}

const removeTrackFromCompilation = (payload: GatheringUpdateReq) => {
  // emit('removeTrackFromCompilation', payload)
}

const confirmDelete = () => {

}

const selectCollection = (payload: Pick<GatheringUpdateReq, 'isInList' | 'gatheringID'>) => {
  if (!album.value?._id) {
    throw new Error('Album has not been fetched yet')
  }

  collectionUpdatePayload.value = {
    ...payload,
    entityType: 'collections',
    entityID: album.value._id,
    order: payload.isInList ? -1 : 1
  }
}

const createCollection = (title: string) => {
  if (!album.value?._id) {
    throw new Error('Album has not been fetched yet')
  }

  newCollectionPayload.value = {
    title,
    entityID: album.value._id
  }
}

const relatedAlbums = computed(() => ([
  {
    docs: relatedAlbumsByArtist.value?.docs || [],
    name: album.value?.artist.title || ''
  },
  {
    docs: relatedAlbumsByGenre.value?.docs || [],
    name: album.value?.genre.title || ''
  }
]).filter(({ docs }) => !!docs.length))

watch(
  [initialCollections, updatedCollections, increasedCollections],
  ([a, b, c], [oldA, oldB, oldC]) => {
    newCollectionPayload.value = null
    collectionUpdatePayload.value = null
    
    if (!!a && a !== oldA) {
      collections.value = a?.docs
    } else if (!!b && b !== oldB) {
      collections.value = b.docs
    } else if (!!c && c !== oldC) {
      collections.value = c.docs
    }
  }
)

onUnmounted(() => {
  newCollectionPayload.value = null
  collectionUpdatePayload.value = null
})

// fetchDiscogsInfo(payload)
</script>
