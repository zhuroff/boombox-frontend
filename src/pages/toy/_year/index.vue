<template>
  <AlbumPageTemplate
    :isDataFetched="!isPageLoading"
    :album="album"
    :booklet="booklet"
    :relatedAlbums="relatedAlbums"
    :isTOY="true"
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
        :withActions="false"
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
      </AlbumHero>
    </template>
  </AlbumPageTemplate>
</template>

<script lang="ts">
import { PropType, defineComponent, ref, watch } from 'vue'
import { AlbumItemRes, AlbumPageRes, CloudEntity } from '~/types/ReqRes'
import store from '~/store'
import cloudServices from '~/services/cloud.services'
import AlbumPage from '~/classes/AlbumPage'
import AlbumPageTemplate from '~/templates/AlbumPageTemplate.vue'
import { BasicEntity } from '~/types/Common'
import BookletState from '~/classes/BookletState'
import { AlbumBooklet, BookletSlideState, RelatedAlbums } from '~/types/Album'
import { CloudFolderResponse } from '~/types/Cloud'
import CoverArt from '~/components/CoverArt.vue'
import AlbumHero from '~/components/AlbumHero.vue'
import { useSinglePage } from '~/hooks/useSinglePage'

export default defineComponent({
  name: 'TOYYearPage',
  components: {
    CoverArt,
    AlbumHero,
    AlbumPageTemplate
  },
  props: {
    params: {
      type: Object as PropType<CloudEntity>,
      required: false
    },
    title: {
      type: String,
      required: true
    },
    backPath: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const {
      booklet,
      isDataFetched,
      fetchBooklet,
      getRandomAlbum,
      getRelatedAlbums,
      closeBookletModal,
      bookletPageChanged
    } = useSinglePage<AlbumPageRes, AlbumPage, AlbumItemRes>(AlbumPage, 'AlbumCard', 'albums')

    const { actions } = store
    const isPageLoading = ref(true)
    const album = ref<AlbumPage>({} as AlbumPage)
    const genreParams = ref<CloudEntity>({} as CloudEntity)
    const relatedAlbums = ref<RelatedAlbums[]>([])

    const bookletHandler = async () => {}

    const fetchTOYAlbum = async (path: string) => {
      try {
        const yearFolder = await cloudServices.getFolderContent(
          '',
          String(process.env.VUE_APP_TOY_CLOUD),
          encodeURIComponent(`${path}/${props.title}`)
        )

        let coverURL: string
        let coverPath = yearFolder.items.find(
          (item) => item.title === 'cover.webp' && item.mimeType === 'image/webp'
        )?.path

        if (coverPath) {
          coverPath = decodeURIComponent(coverPath).replace('MelodyMap/TOY/', '')
          coverURL = await cloudServices.getFile(
            'cloud/image',
            coverPath,
            String(process.env.VUE_APP_TOY_CLOUD),
            'image',
            'TOY'
          )
        } else {
          coverURL = '/img/album.webp'
        }

        const x: AlbumPage = {
          _id: genreParams.value.id,
          // title: `Tracks of The Years: ${genreParams.value.title} - ${props.title}`,
          title: genreParams.value.title,
          caption: `Tracks of The Years / ${props.title} / ${genreParams.value.title}`,
          cloudURL: String(genreParams.value.cloudURL),
          folderName: `TOY/${genreParams.value.path}/${props.title}`,
          inCollections: [],
          cardType: 'AlbumCard',
          cardPath: props.title,
          artist: { title: 'Tracks of The Years' } as BasicEntity,
          genre: {} as BasicEntity,
          period: { title: props.title } as BasicEntity,
          coverURL,
          tracks: yearFolder.items.reduce<any>((acc, next, index) => {
            if (next.mimeType?.startsWith('audio')) {
              acc.push({
                _id: next.id,
                title: next.title.replace(/^\d+\.\s|\.\w+$/g, ''),
                period: props.title,
                path: next.path.replace('MelodyMap%2FTOY%2F', ''),
                order: index,
                lyrics: '',
                listened: 0,
                isOutOfAlbumList: false,
                isDisabled: false,
                inCompilations: [],
                inAlbum: {},
                duration: 0,
                cloudURL: next.cloudURL,
                artist: { title: 'Various Artists' },
                albumCover: coverURL
              })
            }
            return acc
          }, [])
        }
        album.value = x
        actions.setPlayerPlaylist(x)
        isPageLoading.value = false
      } catch (error) {
        console.error(error)
      }
    }

    watch(
      props,
      (value) => {
        if (value.params) {
          genreParams.value = value.params
          fetchTOYAlbum(`TOY/${value.params.path}`)
        }
      },
      { immediate: true, deep: true }
    )

    return {
      isPageLoading,
      album,
      booklet,
      relatedAlbums,
      closeBookletModal,
      bookletHandler,
      bookletPageChanged
    }
  }
})
</script>
