<template>
  <section class="template">
    <transition name="fade">
      <Loader
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
              template="offset"
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
import { computed, ref } from 'vue'
import useGlobalStore from '~/store/global'
import useGetPage from '~/shared/useGetPage'
import useGetList from '~/shared/model/useGetList'
import { Loader } from '~shared/UI'
import PageHeadAdapter from '~/components/PageHeadAdapter/PageHeadAdapter.vue'
import EntityCards from '~/components/Cards/EntityCards.vue'
import DatabaseService from '~/shared/api/DatabaseService'

const { globalGetters: { localize } } = useGlobalStore()

const dbService = new DatabaseService()

const pageEntityKey = ref('embedded')
const preRandomState = ref('')

const { data: album, isFetched: isAlbumFetched } = useGetPage<Embedded>(pageEntityKey, dbService, preRandomState)

const relatedAlbumsReqConfig: RequestConfig = {
  page: 1,
  limit: 5,
  sort: { title: 1 },
  isRandom: 1
}

const isAlbumReady = computed(() => (
  Boolean(album.value) && isAlbumFetched.value
))

const getRandomAlbum = () => {
  preRandomState.value = album.value?._id || ''
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

const { data: relatedAlbumsByArtist } = useGetList<Embedded>(artistConfig, dbService, isAlbumReady)
const { data: relatedAlbumsByGenre } = useGetList<Embedded>(genreConfig, dbService, isAlbumReady)

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

<style scoped lang="scss">
.album {

  &__content {
    grid-template-columns: 350px 1fr;
  }

  &__related {
    grid-column: 2;

    &-title {
      text-align: left;
      margin-left: 10px;
    }
  }
}
</style>
