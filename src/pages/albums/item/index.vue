<template>
  <AlbumPageTemplate
    :isDataFetched="isDataFetched"
    :album="album"
    :booklet="booklet"
    :relatedAlbums="relatedAlbums"
    :discogsTablePayload="discogsTablePayload"
    :discogsFilters="discogsFilters"
    :discogsFiltersStates="discogsFiltersStates"
    @filter:update="setDiscogsFilterValue"
    @filter:reset="resetDiscogsFilters"
    @switchPagination="setDiscogsPaginationPage"
    @closeBookletModal="closeBookletModal"
    @bookletPageChanged="(data) => {
      bookletPageChanged(data, album.folderName, album.cloudURL)
    }"
  >
    <template #hero>
      <AlbumHero
        v-if="album._id"
        :id="album._id"
        :title="album.title"
        :artist="album.artist"
        :genre="album.genre"
        :period="album.period"
        :totalCounts="totalCounts"
        @getRandomAlbum="getRandom"
      >
        <template #cover>
          <CoverArt
            :cover="album.coverURL"
            :booklet="booklet"
            @coverClick="() => bookletHandler()"
            @closeBookletModal="closeBookletModal"
            @slideChanged="bookletPageChanged"
          />
        </template>
        <template #navlist>
          <li
            class="overlay__list-item"
            @click="addAlbumToPlaylist"
          >{{ lang('player.addToList') }}</li>
          <li
            class="overlay__list-item"
            @click="openCollectionsModal"
          >{{ lang('collections.add') }}</li>
        </template>
      </AlbumHero>
    </template>
    <template #modal>
      <Modal
        v-if="isCollectionLoading || collections"
        :isModalActive="isCollectionLoading"
        @closeModal="closeCollectionModal"
      >
        <GatheringTabs
          v-if="!isCollectionLoading && collections"
          :isLoading="isCollectionLoading"
          :results="collections"
          :pagination="collectionsPagination"
          :entityID="album._id"
          placeholderImage="/img/album.webp"
          entityType="collections"
        />
      </Modal>
    </template>
  </AlbumPageTemplate>
</template>

<script lang="ts">
import { defineComponent, onMounted, computed, ref, watch } from 'vue'
import { AlbumPageRes, CollectionEntityRes } from '~/types/ReqRes'
import { BasicEntity, RequestFilter } from '~/types/Common'
import { RelatedAlbums } from '~/types/Album'
import { useSinglePage } from '~/hooks/useSinglePage'
import { useListPage } from '~/hooks/useListPage'
import { useDiscogs } from '~/hooks/useDiscogs'
import { useLocales } from '~/hooks/useLocales'
import { conjugate } from '~/utils'
import store from '~/store'
import AlbumPage from '~/classes/AlbumPage'
import AlbumItem from '~/classes/AlbumItem'
import CollectionEntity from '~/classes/CollectionEntity'
import AlbumPageTemplate from '~/templates/AlbumPageTemplate.vue'
import CoverArt from '~/components/CoverArt.vue'
import AlbumHero from '~/components/AlbumHero.vue'
import GatheringTabs from '~/components/GatheringTabs.vue'
import Modal from '~/components/Modal.vue'

export default defineComponent({
  name: 'AlbumPage',
  components: {
    AlbumPageTemplate,
    GatheringTabs,
    AlbumHero,
    CoverArt,
    Modal
  },
  setup() {
    const {
      fetchData,
      booklet,
      isDataFetched,
      fetchBooklet,
      getRandomAlbum,
      getRelatedAlbums,
      closeBookletModal,
      bookletPageChanged,
      route
    } = useSinglePage<AlbumPageRes, AlbumPage>(AlbumPage, 'AlbumCard', 'albums')

    const {
      fetchData: fetchCollections,
      pagePagination: collectionsPagination
    } = useListPage<
      CollectionEntityRes<BasicEntity>,
      CollectionEntity<BasicEntity>
    >(CollectionEntity, '', '')

    const {
      fetchDiscogsInfo,
      discogsTablePayload,
      discogsFiltersStates,
      setDiscogsFilterValue,
      setDiscogsPaginationPage,
      resetDiscogsFilters,
      discogsFilters
    } = useDiscogs()

    const { lang } = useLocales()
    const { actions } = store
    const album = ref<AlbumPage>({} as AlbumPage)
    const relatedAlbums = ref<RelatedAlbums[]>([])
    const isCollectionLoading = ref(false)
    const collections = ref<CollectionEntity<BasicEntity>[] | undefined>(undefined)
    const entityType = ref('albums')

    const getRandom = () => {
      getRandomAlbum(entityType.value)
        .then((payload) => payload && fetchDiscogsInfo(payload))
    }

    const getRelated = async () => {
      const relatedAlbumsConfig: RequestFilter[] = [
        {
          from: 'artists',
          key: 'artist._id',
          name: album.value.artist.title,
          value: album.value.artist._id,
          excluded: {
            _id: album.value._id
          }
        },
        {
          from: 'genres',
          key: 'genre._id',
          name: album.value.genre.title,
          value: album.value.genre._id,
          excluded: {
            _id: album.value._id,
            'artist._id': album.value.artist._id
          }
        }
      ]

      try {
        relatedAlbums.value = []
        const response = await Promise.all(relatedAlbumsConfig.map(async (config) => (
          await getRelatedAlbums(config, entityType.value)
        )))
        
        relatedAlbums.value = response.map(({ docs, name}) => ({
          name,
          docs: docs.map<AlbumItem>((album) => new AlbumItem(album, 'AlbumCard', 'albums'))
        }))
      } catch (error) {
        console.error(error)
      }
    }

    const bookletHandler = async () => {
      if (booklet.value.isEmpty) {
        actions.setSnackbarMessage({
          message: lang('bookletNotFound'),
          type: 'error'
        })
        return false
      }

      await fetchBooklet(album.value.folderName, album.value.cloudURL)

      if (booklet.value.isEmpty) {
        actions.setSnackbarMessage({
          message: lang('bookletNotFound'),
          type: 'error'
        })
      }
    }

    const addAlbumToPlaylist = () => {
      actions.addAlbumToPlaylist()
    }

    const calcTotalTracksTime = (tracks: AlbumPage['tracks']): string => {
      const totalDurationInSeconds = tracks.reduce((acc, next) => (
        acc + (Number(next.duration) || 0)
      ), 0)

      const hours = Math.floor(totalDurationInSeconds / 3600)
      const minutes = Math.floor((totalDurationInSeconds % 3600) / 60)
      const seconds = Math.floor(totalDurationInSeconds % 60)

      const formattedTime = `
        ${hours.toString().padStart(2, '0')}:
        ${minutes.toString().padStart(2, '0')}:
        ${seconds.toString().padStart(2, '0')}
      `.replace(/\s+/g, '')

      return formattedTime
    }

    const openCollectionsModal = async () => {
      isCollectionLoading.value = true
      collections.value = await fetchCollections('collections')
      isCollectionLoading.value = false
    }

    const closeCollectionModal = () => {
      isCollectionLoading.value = false
      collections.value = undefined
    }

    const totalCounts = computed(() => {
      const isAllTracksHaveDuration = album.value.tracks?.every((track) => (
        Number(track.duration)
      ))
      
      return `
        ${album.value.tracks?.length} ${conjugate('tracks', album.value.tracks?.length)}:
        ${isAllTracksHaveDuration ? calcTotalTracksTime(album.value.tracks) : lang('unknownTime')}.
        ${lang('listenedTracks')} ${album.value.tracks?.reduce((acc, { listened }) => (
          acc + (Number(listened) || 0)
        ), 0)}
      `.trim()
    })

    watch(
      route,
      (newValue) => {
        if (newValue.params.id && newValue.params.id !== album.value._id) {
          album.value = {} as AlbumPage
          fetchData(entityType.value)
            .then((payload) => {
              if (payload) {
                album.value = payload
                actions.setPlayerPlaylist(payload)
                getRelated()
                fetchDiscogsInfo(payload)
              }
            })
        }
      },
      { immediate: false }
    )

    onMounted(() => {
      fetchData(entityType.value)
        .then((payload) => {
          if (payload) {
            album.value = payload
            actions.setPlayerPlaylist(payload)
            getRelated()
            fetchDiscogsInfo(payload)
          }
        })
    })

    return {
      lang,
      album,
      booklet,
      entityType,
      getRelated,
      totalCounts,
      collections,
      bookletHandler,
      isDataFetched,
      relatedAlbums,
      closeBookletModal,
      addAlbumToPlaylist,
      discogsTablePayload,
      isCollectionLoading,
      discogsFiltersStates,
      setDiscogsFilterValue,
      openCollectionsModal,
      closeCollectionModal,
      collectionsPagination,
      setDiscogsPaginationPage,
      resetDiscogsFilters,
      bookletPageChanged,
      discogsFilters,
      getRandom
    }
  }
})
</script>
