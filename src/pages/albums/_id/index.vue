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
              :cover="albumCover"
              :bookletID="albumBookletID"
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

          <!-- <div class="album__content">
            <AlbumHeading
              :heading="albumHeading"
              @textInputHandler="saveAlbumDescription"
            />

            <AlbumTrackList
              :album="albumContent"
              @changeTracksOrder="changeTracksOrder"
              @saveLyrics="saveLyrics"
            />
          </div> -->
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
import { defineComponent, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'
import { key } from '~/store'
// import axios from 'axios'
import AppPreloader from '~/components/AppPreloader.vue'
import AlbumCoverArt from '~/components/AlbumCoverArt.vue'
// import AlbumHeading from '~/components/AlbumHeading.vue'
// import AlbumTrackList from '~/components/TrackList/TrackList.vue'
// import AppListModal from '~/components/AppListModal/AppListModal.vue'
// // import DiscogsTable from '~/components/DiscogsTable.vue'
// import AppModal from '~/components/AppModal.vue'
// import AppSlider from '~/components/AppSlider.vue'

export default defineComponent({
  components: {
    AlbumCoverArt,
    AppPreloader,
    // AlbumHeading,
    // AlbumTrackList,
    // AppListModal,
    // // DiscogsTable,
    // AppModal,
    // AppSlider
  },

  setup() {
    const route = useRoute()
    const store = useStore(key)

    onMounted(() => {
      store.dispatch('fetchAlbum', route.params.id)
    })

    // const lists = ref(null)
    // const inputTimer = ref(0)

    // const booklet = reactive({
    //   isFetching: false,
    //   data: []
    // })

    const albumIsLoaded = computed(() => store.getters.albumIsLoaded)
    const albumCover = computed(() => store.getters.albumCover)
    const albumBookletID = computed(() => store.getters.albumBookletID)
    // const albumHeading = computed(() => store.getters.albumHeading)
    // const albumContent = computed(() => store.getters.album)
    // const discogsData = reactive(computed(() => store.getters.discogsData))
    // const discogsPagination = computed(() => store.getters.discogsPagination)
    // const clearfiedLists = computed(() => (
    //   lists.value?.map((el) => ({
    //     id: el._id,
    //     title: el.title,
    //     items: el.albums.map((album) => album.album._id)
    //   })) || []
    // ))

    // const changeTracksOrder = (payload) => {
    //   store.commit('updateAlbumsTracksOrder', payload)

    //   if (albumContent.value._id === store.getters.currentPlaylist._id) {
    //     store.commit('setPrevNextTracks')
    //   }
    // }

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

    // const patchDescription = async (value) => {
    //   const payload = { description: value }

    //   try {
    //     await axios.patch(`/api/albums/${route.params.id}/description`, payload)
    //   } catch (error) {
    //     console.error(error)
    //   }
    // }

    // const saveAlbumDescription = (value) => {
    //   clearTimeout(inputTimer.value)
    //   inputTimer.value = setTimeout(() => patchDescription(value), 2000)
    // }

    // const saveLyrics = async (payload) => {
    //   try {
    //     await axios.patch(`/api/albums/${store.getters.album._id}/lyrics`, payload)
    //     store.commit('setAlbumLyrics', payload)
    //   } catch (error) {
    //     console.error(error.response)
    //   }
    // }

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
      albumBookletID,
      fetchAlbumBooklet,
      // albumHeading,
      // albumContent,
      // discogsData,
      // discogsPagination,
      // booklet,
      // lists,
      // clearfiedLists,
      // changeTracksOrder,
      // callListsModal,
      // closeBooklet,
      // createNewList,
      // itemAction,
      // closeListModal,
      // saveAlbumDescription,
      // saveLyrics,
      // switchDiscogsPagination
    }
  }
})

</script>
