<template>
  <section class="section">
    <transition name="fade">
      <AppPreloader
        v-if="!albumIsLoaded"
        mode="light"
      />
    </transition>
      
    <div id="scrollspace">
      <transition name="flyUp">
        <div
          v-if="albumIsLoaded"
          class="album"
        >
          <div class="album__aside">
            <AlbumCoverArt
              :albumCover="albumCover"
              :albumCoverArt="albumCoverArt"
              @coverClick="fetchAlbumBooklet"
            />

            <!-- <button
              v-if="!lists"
              class="album__to-list"
              @click="callListsModal"
            >Add to list</button>

            <AppListModal
              v-if="lists"
              :data="clearfiedLists"
              :itemID="albumContent._id"
              placeholder="Create new collection"
              @createNewList="createNewList"
              @itemAction="itemAction"
              @closeListModal="closeListModal"
            /> -->
          </div>

          <div class="album__content">
            <AlbumHeading
              :albumHead="albumHead"
              @textInputHandler="descriptionHandler"
            />

            <TrackList
              :tracks="albumTracks"
              :albumID="albumID"
              @saveLyrics="saveLyrics"
            />
          </div>
        </div>
      </transition>

      <!-- <DiscogsTable
        v-if="discogsData.length"
        :data="discogsData"
        :pagination="discogsPagination"
        @switchPagination="switchDiscogsPagination"
      /> -->
    </div>

    <!-- <transition name="fade">
      <AppModal
        v-if="booklet.isFetching"
        :isModalActive="booklet.isFetching"
        @closeModalForm="closeBooklet"
      >
        <AppSlider :data="booklet"/>
      </AppModal>
    </transition> -->
  </section>
</template>

<script lang="ts">

// import { computed, ref, reactive } from 'vue'
import {
  defineComponent,
  onMounted,
  ComputedRef,
  computed,
  ref,
  Ref
} from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'
import { key } from '~/store'
import { IAlbumFull, IAlbumTrack, AlbumHeadProps } from '~/types/Album'
import { IDraggableEvent } from '~/types/Global'
import AppPreloader from '~/components/AppPreloader.vue'
import AlbumCoverArt from '~/components/AlbumCoverArt.vue'
import AlbumHeading from '~/components/AlbumHeading.vue'
import TrackList from '~/components/TrackList/TrackList.vue'
// import AppListModal from '~/components/AppListModal/AppListModal.vue'
// import DiscogsTable from '~/components/DiscogsTable.vue'
// import AppModal from '~/components/AppModal.vue'
// import AppSlider from '~/components/AppSlider.vue'
import api from '~/api'

export default defineComponent({
  components: {
    AlbumCoverArt,
    AppPreloader,
    AlbumHeading,
    TrackList,
    // AppListModal,
    // DiscogsTable,
    // AppModal,
    // AppSlider
  },

  setup() {
    const route = useRoute()
    const store = useStore(key)

    onMounted(async () => {
      try {
        const albumResponse = await api.get(`/api/albums/${route.params.id}`)

        if (albumResponse?.status === 200) {
          setAlbumState(albumResponse.data)
          store.commit('setPlayerPlaylist', albumResponse.data)
        }
      } catch (error) {
        throw error
      }
    })

    const setAlbumState = (data: IAlbumFull) => {
      album.value = data
      album.value.isLoaded = true
    }

    const album: Ref<IAlbumFull> = ref({
      _id: '',
      albumCover: '',
      title: '',
      artist: { _id: '', title: '' },
      genre: { _id: '', title: '' },
      period: { _id: '', title: '' },
      albumCoverArt: 0,
      description: '',
      tracks: [],
      isLoaded: false
    })

    // const lists = ref(null)
    const inputTimer: Ref<ReturnType<typeof setTimeout> | number> = ref(0)

    // const booklet = reactive({
    //   isFetching: false,
    //   data: []
    // })

    const albumIsLoaded: ComputedRef<boolean> = computed(() => album.value.isLoaded)
    const albumCover: ComputedRef<string> = computed(() => album.value.albumCover)
    const albumCoverArt: ComputedRef<number> = computed(() => album.value.albumCoverArt)
    const albumHead: ComputedRef<AlbumHeadProps> = computed(() => ({
      title: album.value.title,
      artist: album.value.artist,
      period: album.value.period,
      genre: album.value.genre,
      description: album.value.description
    }))
    const albumTracks: ComputedRef<IAlbumTrack[]> = computed(() => album.value.tracks)
    const albumID = computed(() => album.value._id)

    // const discogsData = reactive(computed(() => store.getters.discogsData))
    // const discogsPagination = computed(() => store.getters.discogsPagination)
    // const clearfiedLists = computed(() => (
    //   lists.value?.map((el) => ({
    //     id: el._id,
    //     title: el.title,
    //     items: el.albums.map((album) => album.album._id)
    //   })) || []
    // ))

    // const callListsModal = async () => {
    //   lists.value = []
      
    //   try {
    //     const response = await axios.get('/api/collections')
    //     lists.value = response.data
    //   } catch (error) {
    //     console.error(error.response)
    //   }
    // }

    const fetchAlbumBooklet = async () => {
      console.log('click')
      // if (store.getters.album.albumCoverArt) {
      //   booklet.isFetching = true

      //   try {
      //     const response = await axios.get(`/api/albums/${store.getters.album._id}/${store.getters.album.albumCoverArt}`)
      //     const slides = response.data.map((el) => {
      //       /* eslint no-param-reassign: 0 */
      //       el = el.albumCover
      //       return el
      //     })

      //     booklet.data.push(...slides)
      //   } catch (error) {
      //     booklet.isFetching = false
      //     console.error(error.response)
      //   }
      // }
    }

    // const closeBooklet = () => {
    //   booklet.isFetching = false
    //   booklet.data = []
    // }

    // const createNewList = async (title) => {
    //   const payload = { title, album: albumContent.value._id }

    //   try {
    //     await axios.post('/api/collections/create', payload)
    //     callListsModal()
    //   } catch (error) {
    //     console.log(error.response)
    //   }
    // }

    // const itemAction = async (payload) => {
    //   try {
    //     const response = await axios.patch(`/api/collections/${payload.listID}`, payload)
    //     console.log(response.data)
    //   } catch (error) {
    //     console.error(error.response)
    //   }
    // }

    // const closeListModal = () => {
    //   lists.value = null
    // }

    const patchDescription = async (value: string) => {
      try {
        await api.patch(`/api/albums/${route.params.id}/description`, { description: value })
      } catch (error) {
        throw error
      }
    }

    const descriptionHandler = (value: string) => {
      if (typeof inputTimer.value === 'number') {
        clearTimeout(inputTimer.value)
        inputTimer.value = setTimeout(() => patchDescription(value), 2000)
      }
    }

    const saveLyrics = async (payload: any) => {
      console.log(payload)
      // try {
      //   await axios.patch(`/api/albums/${store.getters.album._id}/lyrics`, payload)
      //   store.commit('setAlbumLyrics', payload)
      // } catch (error) {
      //   console.error(error.response)
      // }
    }

    // const switchDiscogsPagination = (page) => {
    //   const payload = {
    //     album: store.getters.album,
    //     page: page
    //   }
      
    //   store.dispatch('fetchDiscogsData', payload)
    // }

    return {
      albumIsLoaded,
      albumCover,
      albumCoverArt,
      fetchAlbumBooklet,
      albumHead,
      descriptionHandler,
      albumTracks,
      albumID,
      saveLyrics,
      // discogsData,
      // discogsPagination,
      // booklet,
      // lists,
      // clearfiedLists,
      // callListsModal,
      // closeBooklet,
      // createNewList,
      // itemAction,
      // closeListModal,
      // switchDiscogsPagination
    }
  }
})

</script>
