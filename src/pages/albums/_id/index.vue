<template>
  <section class="section">
    <transition name="fade">
      <AppPreloader
        v-if="!album.isFetched"
        mode="light"
      />
    </transition>
      
    <div id="scrollspace">
      <transition name="flyUp">
        <div
          v-if="album.isFetched"
          class="album"
        >
          <div class="album__aside">
            <div class="album__sidebar">
              <AlbumCoverArt
                :albumCover="album.data.albumCover"
                :isBooklet="album.data.albumCoverArt !== 0"
                @coverClick="fetchAlbumBooklet"
              />

              <AppButton
                text="Add to list"
                isFullWidth
                @onClick="callListsModal"
              />

              <!-- <AppListModal
                v-if="lists"
                :data="clearfiedLists"
                :itemID="albumContent._id"
                placeholder="Create new collection"
                @createNewList="createNewList"
                @itemAction="itemAction"
                @closeListModal="closeListModal"
              /> -->
            </div>
          </div>

          <div class="album__content">
            <AlbumHeading
              :albumHead="albumHead"
              @textInputHandler="descriptionHandler"
            />

            <TrackList
              :tracks="album.data.tracks"
              :albumID="album.data._id"
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

    <transition name="fade">
      <AppModal
        v-if="isBookletModalActive"
        :isModalActive="isBookletModalActive"
        @closeModal="closeBookletModal"
      >
        <AppPreloader
          v-if="!Array.isArray(album.data.albumCoverArt)"
          mode="dark"
        />
        
        <AppSlider
          v-else
          :data="album.data.albumCoverArt"
        />
      </AppModal>
    </transition>
  </section>
</template>

<script lang="ts">

// import { computed, ref, reactive } from 'vue'
import {
  defineComponent,
  onMounted,
  ComputedRef,
  computed,
  reactive,
  ref,
  Ref
} from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'
import { key } from '~/store'
import { IAlbumFull, IAlbumTrack, AlbumHeadProps } from '~/types/Album'
import AppPreloader from '~/components/AppPreloader.vue'
import AlbumCoverArt from '~/components/AlbumCoverArt.vue'
import AppButton from '~/components/AppButton.vue'
import AlbumHeading from '~/components/AlbumHeading.vue'
import TrackList from '~/components/TrackList/TrackList.vue'
// import AppListModal from '~/components/AppListModal/AppListModal.vue'
// import DiscogsTable from '~/components/DiscogsTable.vue'
import AppModal from '~/components/AppModal.vue'
import AppSlider from '~/components/AppSlider.vue'
import api from '~/api'

export default defineComponent({
  components: {
    AlbumCoverArt,
    AppButton,
    AppPreloader,
    AlbumHeading,
    TrackList,
    // AppListModal,
    // DiscogsTable,
    AppModal,
    AppSlider
  },

  setup() {
    const route = useRoute()
    const store = useStore(key)

    const inputTimer: Ref<ReturnType<typeof setTimeout> | number> = ref(0)
    const isBookletModalActive = ref(false)

    const album = reactive({
      isFetched: false,
      data: {} as IAlbumFull
    })

    const lists = reactive([])

    // const booklet = reactive({
    //   isFetching: false,
    //   data: []
    // })

    const albumHead: ComputedRef<AlbumHeadProps> = computed(() => ({
      title: album.data.title,
      artist: album.data.artist,
      period: album.data.period,
      genre: album.data.genre,
      description: album.data.description
    }))

    // const discogsData = reactive(computed(() => store.getters.discogsData))
    // const discogsPagination = computed(() => store.getters.discogsPagination)
    // const clearfiedLists = computed(() => (
    //   lists.value?.map((el) => ({
    //     id: el._id,
    //     title: el.title,
    //     items: el.albums.map((album) => album.album._id)
    //   })) || []
    // ))

    const callListsModal = async () => {
      lists.length = 0
      
      try {
        const response = await api.get('/api/collections')
        console.log(response)
        // lists.push(...response.data)
      } catch (error) {
        throw error
      }
    }

    const setAlbumBooklet = (data: { albumCover: string }[]) => {
      album.data.albumCoverArt = data.map((el) => el.albumCover)
    }

    const fetchAlbumBooklet = async () => {
      isBookletModalActive.value = true

      if (Array.isArray(album.data.albumCoverArt)) {

      } else if (album.data.albumCoverArt > 0) {
        try {
          const response = await api.get(`/api/albums/${album.data._id}/${album.data.albumCoverArt}`)
          
          if (response?.status === 201) {
            setAlbumBooklet(response.data)
          }
        } catch (error) {
          throw error
        }
      }
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

    const closeBookletModal = () => {
      isBookletModalActive.value = false
    }

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
    const setAlbumState = (data: IAlbumFull) => {
      album.data = data
      album.isFetched = true
    }

    const fetchAlbumEntry = async () => {
      try {
        const response = await api.get(`/api/albums/${route.params.id}`)

        if (response?.status === 200) {
          setAlbumState(response.data)
          store.commit('setPlayerPlaylist', response.data)
        }
      } catch (error) {
        throw error
      }
    }
    
    onMounted(() => fetchAlbumEntry())

    return {
      album,
      fetchAlbumBooklet,
      albumHead,
      descriptionHandler,
      saveLyrics,
      callListsModal,
      isBookletModalActive,
      closeBookletModal,
      // discogsData,
      // discogsPagination,
      // booklet,
      // lists,
      // clearfiedLists,
      // createNewList,
      // itemAction,
      // closeListModal,
      // switchDiscogsPagination
    }
  }
})

</script>
