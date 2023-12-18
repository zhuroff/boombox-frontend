<template>
  <section class="section">
    <transition name="fade">
      <Preloader v-if="!toyYear.isFetched" mode="light" />
    </transition>

    <div v-if="toyYear.isFetched" class="album">
      <div class="album__aside">
        <div class="album__sidebar">
          <CoverArt :albumCover="toyYear.data.albumCover" :isBooklet="toyYear.data.albumCoverArt?.length > 0"
            @coverClick="fetchAlbumBooklet" />
        </div>
      </div>

      <div class="album__content">
        <TrackList :tracks="toyYear.data.tracks" :albumID="toyYear.data._id" :isTOY="true" @saveToyInfo="saveToyInfo" />
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import api from '~/api'
import { PropType, defineComponent, reactive, watchEffect, ComputedRef, computed } from 'vue'
import { TTOYEntity } from '~/types/TOY'
import Preloader from '~/components/Preloader.vue'
import CoverArt from "~/components/CoverArt.vue"
import TrackList from "~/components/TrackList/TrackList.vue"
import { AlbumHeadProps } from '~/types/Album'

export default defineComponent({
  components: {
    Preloader,
    CoverArt,
    TrackList
  },

  props: {
    year: {
      type: Object as PropType<Partial<TTOYEntity & { genre: string }>>,
      required: true
    }
  },

  setup(props) {
    const toyYear = reactive<any>({
      isFetched: false,
      data: {}
    })

    const fetchYearContent = async () => {
      try {
        const response = await api.post<any[]>('/api/toy', { path: props.year?.path, dirOnly: false })

        if (response?.status === 200) {
          toyYear.data = {
            _id: props.year.resource_id,
            title: `${props.year.genre} - ${props.year.name}`,
            albumCover: response.data.find(({ name }) => name === 'cover.webp')?.file || '/img/album.webp',
            inCollections: [],
            artist: {
              _id: `artist-${props.year.resource_id}`,
              title: 'Various Artists'
            },
            genre: {
              _id: `genre-${props.year.resource_id}`,
              title: props.year.genre
            },
            period: {
              _id: `period-${props.year.resource_id}`,
              title: props.year.name
            },
            albumCoverArt: response.data.find(({ name }) => name === 'booklet')?.path,
            description: '',
            tracks: response.data.reduce((acc, next) => {
              if (next.media_type === 'audio') {
                acc.push({
                  _id: next.resource_id,
                  title: next.name.replace(/^\d+\.\s/g, '').replace(/\.[^.]+$/, ""),
                  link: next.file,
                  // "artist": {
                  //     "_id": "630a97b2bb05f204d7d90a97",
                  //     "title": "Metallica"
                  // },
                  // "inAlbum": {
                  //     "_id": "630a97acf7b94ac644bd8ec0",
                  //     "title": "...And Justice For All"
                  // },
                  // "inPlaylists": []
                })
              }

              return acc
            }, [] as any[])
          }
          toyYear.isFetched = true
          // store.commit("setPlayerPlaylist", toyYear.data);
        }

        fetchDBContent()
      } catch (error) {
        throw error
      }
    }

    const fetchDBContent = async () => {
      const response = await api.get(`/api/toy/${props.year.resource_id?.replace(/[^a-z0-9]+/g, '')}`)
    }

    const fetchAlbumBooklet = async () => {
      console.log('fetch booklet')
    }

    const saveToyInfo = (payload: any) => {
      console.log(props.year)
      console.log(payload)
    }

    watchEffect(() => {
      toyYear.isFetched = false
      fetchYearContent()
    })

    return {
      toyYear,
      fetchAlbumBooklet,
      saveToyInfo
    }
  }
})
</script>

<style lang="scss">
.tototo {
  padding: 25px;
}
</style>
