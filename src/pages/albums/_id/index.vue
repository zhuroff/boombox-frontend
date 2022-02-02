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
                text="Add to collection"
                isFullWidth
                @onClick="callCollectionsModal"
              />

              <FloatModal
                v-if="collections.isActive"
                :isFetched="collections.isFetched"
                :isEmpty="!collections.data.length"
                placeholder="Create new collection"
                @createNewEntry="createNewCollection"
                @closeFloatModal="closeCollectionsModal"
              >
                <template v-slot:empty>
                  <div class="float-modal__empty">
                    <strong>You haven't created any collections yet</strong>
                    <span>To create a collection, use the form below</span>
                  </div>
                </template>

                <template v-slot:list>
                  <ul class="float-modal__list">
                    <FloatModalItem
                      v-for="item in collections.data"
                      :key="item.id"
                      :item="item"
                      :itemID="album.data._id"
                      :isChecked="isCollectionItemChecked(item)"
                      @checkFloatModalItem="addOrRemoveFromCollection"
                    />
                  </ul>
                </template>
              </FloatModal>
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
              :artist="album.data.artist"
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
      <Modal
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
      </Modal>
    </transition>
  </section>
</template>

<script lang="ts">

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
import { IAlbumFull, AlbumHeadProps } from '~/types/Album'
import { ICollectionPayloadPost, ICollectionBasic } from '~/types/Collection'
import { IFloatModalCheckAction } from '~/types/Global'
import AppPreloader from '~/components/Preloader/Preloader.vue'
import AlbumCoverArt from '~/components/AlbumCoverArt.vue'
import AppButton from '~/components/AppButton.vue'
import AlbumHeading from '~/components/AlbumHeading.vue'
import TrackList from '~/components/TrackList/TrackList.vue'
import FloatModal from '~/components/FloatModal/FloatModal.vue'
import FloatModalItem from '~/components/FloatModal/FloatModalItem.vue'
// import DiscogsTable from '~/components/DiscogsTable.vue'
import Modal from '~/components/Modal/Modal.vue'
import AppSlider from '~/components/AppSlider.vue'
import api from '~/api'

export default defineComponent({
  components: {
    AlbumCoverArt,
    AppButton,
    AppPreloader,
    AlbumHeading,
    TrackList,
    FloatModal,
    FloatModalItem,
    // DiscogsTable,
    Modal,
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

    const collections = reactive({
      isFetched: false,
      isActive: false,
      data: [] as ICollectionBasic[]
    })

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

    const isCollectionItemChecked = (item: ICollectionBasic) => (
      item.albums.some((el) => el.album._id === album.data._id)
    )

    const closeCollectionsModal = () => {
      collections.data = []
      collections.isFetched = false
      collections.isActive = false
    }

    const setCollections = (data: ICollectionBasic[]) => {
      collections.data = data
      collections.isFetched = true
    }

    const fetchCollections = async () => {
      try {
        const response = await api.get('/api/collections')

        if (response.status === 200) {
          setCollections(response.data)
        }
      } catch (error) {
        throw error
      }
    }

    const callCollectionsModal = () => {
      collections.isActive = true
      fetchCollections()
    }

    const setAlbumBooklet = (data: { albumCover: string }[]) => {
      album.data.albumCoverArt = data.map((el) => el.albumCover)
    }

    const fetchAlbumBooklet = async () => {
      if (Array.isArray(album.data.albumCoverArt)) {
        isBookletModalActive.value = true
      } else if (album.data.albumCoverArt > 0) {
        isBookletModalActive.value = true

        try {
          const response = await api.get(`/api/albums/${album.data._id}/${album.data.albumCoverArt}`)
          
          if (response?.status === 201) {
            setAlbumBooklet(response.data)
          }
        } catch (error) {
          throw error
        }
      }
    }

    const closeBookletModal = () => {
      isBookletModalActive.value = false
    }

    const createNewCollection = async (title: string) => {
      collections.isFetched = false

      const payload: ICollectionPayloadPost = {
        title,
        album: album.data._id
      }

      try {
        const response = await api.post('/api/collections/create', payload)

        if (response?.status === 200) {
          store.commit('setSnackbarMessage', {
            message: response.data.message,
            type: 'success'
          })

          fetchCollections()
        }
      } catch (error) {
        throw error
      }
    }

    const addOrRemoveFromCollection = async (payload: IFloatModalCheckAction) => {
      const targetCollection = collections.data.find((collection) => (
        collection._id === payload.listID
      ))
      
      if (targetCollection) {
        try {
          const response = await api.patch(`/api/collections/${payload.listID}`, payload)

          if (response?.status === 200) {
            store.commit('setSnackbarMessage', {
              message: response.data.message,
              type: 'success'
            })

            fetchCollections()
          }
        } catch (error) {
          throw error
        }
      }
    }

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
      callCollectionsModal,
      isBookletModalActive,
      closeBookletModal,
      collections,
      createNewCollection,
      closeCollectionsModal,
      addOrRemoveFromCollection,
      isCollectionItemChecked
      // discogsData,
      // discogsPagination,
      // switchDiscogsPagination
    }
  }
})

</script>
