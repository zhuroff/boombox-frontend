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
        @getRandomAlbum="getRandom"
      />
    </template>
    <template #frame>
      <div
        v-html="album.frame"
        class="album__frame"
      />
    </template>
  </AlbumPageTemplate>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import { useDiscogs } from '~/hooks/useDiscogs'
import { useSinglePage } from '~/hooks/useSinglePage'
import { RelatedAlbums } from '~/types/Album'
import { RequestFilter } from '~/types/Common'
import { EmbeddedItemRes } from '~/types/ReqRes'
import AlbumItem from '~/classes/AlbumItem'
import EmbeddedItem from '~/classes/EmbeddedItem'
import AlbumPageTemplate from '~/templates/AlbumPageTemplate.vue'
import AlbumHero from '~/components/AlbumHero.vue'

export default defineComponent({
  components: {
    AlbumPageTemplate,
    AlbumHero
  },
  setup() {
    const {
      fetchData,
      isDataFetched,
      getRandomAlbum,
      getRelatedAlbums
    } = useSinglePage<EmbeddedItemRes, EmbeddedItem>(EmbeddedItem, 'EmbeddedCard', 'embedded')

    const {
      fetchDiscogsInfo,
      discogsTablePayload,
      discogsFiltersStates,
      setDiscogsFilterValue,
      setDiscogsPaginationPage,
      resetDiscogsFilters,
      discogsFilters
    } = useDiscogs()

    const album = ref<EmbeddedItem>({} as EmbeddedItem)
    const relatedAlbums = ref<RelatedAlbums[]>([])

    const getRandom = () => {
      getRandomAlbum('albums')
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

    return {
      isDataFetched,
      relatedAlbums,
      discogsTablePayload,
      discogsFiltersStates,
      setDiscogsFilterValue,
      setDiscogsPaginationPage,
      resetDiscogsFilters,
      discogsFilters,
      getRandom,
      album
    }
  }
})
</script>

<style lang="scss">
@import '~/scss/variables';
@import 'include-media';

.album {

  iframe {
    border-radius: $borderRadiusSM;
  }
}
</style>
