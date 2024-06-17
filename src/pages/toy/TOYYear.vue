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
import { defineComponent, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { AlbumItemRes, AlbumPageRes, TrackRes } from '~/types/ReqRes'
import { RelatedAlbums } from '~/types/Album'
import { useSinglePage } from '~/hooks/useSinglePage'
import cloudServices from '~/services/cloud.services'
import AlbumPage from '~/classes/AlbumPage'
import AlbumPageTemplate from '~/templates/AlbumPageTemplate.vue'
import CoverArt from '~/components/CoverArt.vue'
import AlbumHero from '~/components/AlbumHero.vue'
import store from '~/store'

export default defineComponent({
  name: 'TOYYearPage',
  components: {
    CoverArt,
    AlbumHero,
    AlbumPageTemplate
  },
  setup() {
    const {
      booklet,
      closeBookletModal,
      bookletPageChanged
    } = useSinglePage<AlbumPageRes, AlbumPage, AlbumItemRes>(AlbumPage, 'AlbumCard', 'albums')

    const route = useRoute()
    const { actions } = store
    const isPageLoading = ref(true)
    const album = ref<AlbumPage>({} as AlbumPage)
    const relatedAlbums = ref<RelatedAlbums[]>([])

    const bookletHandler = async () => {
      booklet.value.isActive = true

      if (booklet.value.items.length) return

      const res = await cloudServices.getFolderContent(
        '',
        String(process.env.VUE_APP_TOY_CLOUD),
        encodeURIComponent(`TOY/${route.params.genre}/${route.params.year}/booklet`)
      )

      const images = await Promise.all(res.items.map(async (item) => ({
        ...item,
        url: await cloudServices.getFile<string>(
          'cloud/image',
          decodeURIComponent(item.path).replace('MelodyMap/TOY/', ''),
          String(process.env.VUE_APP_TOY_CLOUD),
          'image',
          'TOY'
        )
      })))

      if (images?.length) {
        booklet.value.items.push(...images)
        booklet.value.total = images.length
        booklet.value.isCompleted = true
        booklet.value.isFetched = true
      }
    }

    const fetchTOYAlbum = async () => {
      try {
        const yearFolder = await cloudServices.getFolderContent(
          '',
          String(process.env.VUE_APP_TOY_CLOUD),
          encodeURIComponent(`${`TOY/${route.params.genre}`}/${route.params.year}`)
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

        album.value = new AlbumPage({
          _id: String(route.params.year),
          title: `TOY: ${route.params.genre}`,
          artist: { title: 'Various Artists', _id: '' },
          period: { title: String(route.params.year), _id: '' },
          coverURL,
          tracks: yearFolder.items.reduce<TrackRes[]>((acc, next, index) => {
            if (next.mimeType?.startsWith('audio')) {
              acc.push({
                _id: next.id,
                title: next.title.replace(/^\d+\.\s|\.\w+$/g, ''),
                artist: { title: 'Various Artists', _id: '' },
                genre: { title: String(route.params.genre), _id: '' },
                period: { title: String(route.params.year), _id: '' },
                inAlbum: { title: 'Tracks of The Years', _id: '' },
                path: next.path.replace('MelodyMap%2FTOY%2F', ''),
                isTOY: true,
                order: index,
                cloudURL: String(next.cloudURL)
              })
            }
            return acc
          }, [])
        })

        actions.setPlayerPlaylist(album.value)
      } catch (error) {
        console.error(error)
      } finally {
        isPageLoading.value = false
      }
    }

    watch(
      route,
      (value) => {
        if (value.params?.genre) {
          fetchTOYAlbum()
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
