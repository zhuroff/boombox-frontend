<template>
  <AlbumPageTemplate
    :isDataFetched="isDataFetched"
    :album="album"
    :relatedAlbums="relatedAlbums"
    :discogsTablePayload="discogsTablePayload"
    :discogsFilters="discogsFilters"
    :discogsFiltersStates="discogsFiltersStates"
    @filter:update="setDiscogsFilterValue"
    @filter:reset="resetDiscogsFilters"
    @switchPagination="setDiscogsPaginationPage"
  >
    <template #hero>
      <AlbumHero
        v-if="album._id"
        :id="album._id"
        :title="album.title"
        :artist="album.artist"
        :genre="album.genre"
        :period="album.period"
        :frame="album.frame"
        @getRandomAlbum="getRandom"
      >
        <template #navlist>
          <li
            v-if="isAdmin"
            class="overlay__list-item"
            @click="isDelConfirm = true"
          >{{ localize('deleteEntity') }}</li>
        </template>
      </AlbumHero>
    </template>
    <template #modal>
      <Modal
        v-if="isDelConfirm"
        :isModalActive="isDelConfirm"
        @closeModal="delReject"
      >
        <Confirmation
          :message="localize('delConfirmMessage')"
          @confirm="deleteEmbedded"
          @reject="delReject"
        />
      </Modal>
    </template>
  </AlbumPageTemplate>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useDiscogs } from '~/hooks/useDiscogs'
import { useSinglePage } from '~/hooks/useSinglePage'
import useGlobalStore from '~/store/global'
import { RelatedAlbums } from '~/types/Album'
import { RelatedAlbumsReqFilter } from '~/types/Common'
import { AlbumItemRes, EmbeddedItemRes } from '~/types/ReqRes'
import AlbumItem from '~/classes/AlbumItem'
import EmbeddedItem from '~/classes/EmbeddedItem'
import AlbumPageTemplate from '~/templates/AlbumPageTemplate.vue'
import AlbumHero from '~/components/AlbumHero.vue'
import Confirmation from '~/components/Confirmation.vue'
import Modal from '~/components/Modal.vue'

const {
  fetchData,
  deleteEntry,
  isDataFetched,
  getRandomAlbum,
  getRelatedAlbums
} = useSinglePage<EmbeddedItemRes, EmbeddedItem, AlbumItemRes>(EmbeddedItem, 'EmbeddedCard', 'embedded')

const {
  fetchDiscogsInfo,
  discogsTablePayload,
  discogsFiltersStates,
  setDiscogsFilterValue,
  setDiscogsPaginationPage,
  resetDiscogsFilters,
  discogsFilters
} = useDiscogs()

const {
  globalGetters: { localize, authConfig }
} = useGlobalStore()

const album = ref<EmbeddedItem>({} as EmbeddedItem)
const relatedAlbums = ref<RelatedAlbums[]>([])
const isDelConfirm = ref(false)

const isAdmin = computed(() => (
  authConfig.value.user?.role === 'admin'
))

const getRandom = () => {
  getRandomAlbum('albums')
    .then((payload) => payload && fetchDiscogsInfo(payload))
}

const getRelated = async () => {
  const relatedAlbumsConfig: RelatedAlbumsReqFilter[] = [
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
      await getRelatedAlbums(config, 'albums')
    )))
    
    relatedAlbums.value = response.map(({ docs, name}) => ({
      name,
      docs: docs.map<AlbumItem>((album) => new AlbumItem(album, 'AlbumCard', 'albums'))
    }))
  } catch (error) {
    console.error(error)
  }
}

const delReject = () => {
  isDelConfirm.value = false
}

const deleteEmbedded = () => {
  deleteEntry('embedded', album.value._id)
}

onMounted(() => {
  fetchData('embedded')
    .then((payload) => {
      if (payload) {
        album.value = payload
        getRelated()
        fetchDiscogsInfo(payload)
      }
    })
})
</script>

<style lang="scss">
@import '~/scss/variables';
@import 'include-media';

.album {

  iframe {
    border-radius: $borderRadiusSM;
    min-height: 500px;
  }
}
</style>
