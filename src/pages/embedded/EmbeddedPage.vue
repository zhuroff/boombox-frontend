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
        />
        <div class="album__content">
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
              placeholderPreview="/img/album.webp"
              @deleteEntity="confirmDelete"
            />
          </div>
        </div>
      </div>
    </transition>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import useGlobalStore from '~/store/global'
import useEntityPage from '~/shared/useEntityPage'
import useEntityList from '~/shared/useEntityList'
import Preloader from '~/components/Preloader.vue'
import PageHeadAdapter from '~/components/PageHeadAdapter/PageHeadAdapter.vue'
import EntityCards from '~/components/EntityCards.vue'

const { globalGetters: { localize, isAdmin } } = useGlobalStore()

const { data: album, isFetched: isAlbumFetched } = useEntityPage<Embedded>('embedded')

const relatedAlbumsReqConfig: RequestConfig = {
  page: 1,
  limit: 5,
  sort: { title: 1 },
  isRandom: true
}

const isAlbumReady = computed(() => (
  Boolean(album.value) && isAlbumFetched.value
))

const getRandomAlbum = (entityType: string) => {
  console.log('GET RANDOM', entityType)
}

const confirmDelete = () => {

}

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
            excluded: { _id: album.value._id, 'artist._id': album.value.artist._id }
          }
        }
      }
    : {} as UseEntityListPayload
))

const { data: relatedAlbumsByArtist } = useEntityList<Embedded>(artistConfig, isAlbumReady)
const { data: relatedAlbumsByGenre } = useEntityList<Embedded>(genreConfig, isAlbumReady)

const relatedAlbums = computed(() => ([
  {
    docs: relatedAlbumsByArtist.value?.docs || [],
    name: album.value?.artist.title || ''
  },
  {
    docs: relatedAlbumsByGenre.value?.docs || [],
    name: album.value?.genre.title || ''
  }
]).filter(({ docs }) => docs.length))

// fetchDiscogsInfo(payload)
</script>
