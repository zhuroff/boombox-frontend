<template>
  <section class="template">
    <transition name="fade">
      <Preloader
        v-if="!isAlbumReady"
        mode="light"
      />
    </transition>
    <transition name="fade">
      <AlbumPageTemplate
        v-if="album"
        :album="album"
        :relatedAlbums="relatedAlbums"
      >
        <template #head>
          <PageHeadAdapter
            :album="album"
            @getRandomAlbum="getRandom"
          />
        </template>
      </AlbumPageTemplate>
    </transition>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import useEntityPage from '~/shared/useEntityPage'
import useEntityList from '~/shared/useEntityList'
import Preloader from '~/components/Preloader.vue'
import AlbumPageTemplate from '~/templates/AlbumPageTemplate.vue'
import PageHeadAdapter from '~/components/PageHeadAdapter/PageHeadAdapter.vue'

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

const getRandom = () => {
  console.log('GET RANDOM')
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
]))

// fetchDiscogsInfo(payload)
</script>
