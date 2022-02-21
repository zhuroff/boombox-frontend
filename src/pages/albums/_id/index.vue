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

              <Button
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
import { ICollectionBasic } from '~/types/Collection'
import { IFloatModalCheckAction } from '~/types/Global'
import AppPreloader from '~/components/Preloader/Preloader.vue'
import AlbumCoverArt from '~/components/AlbumCoverArt.vue'
import Button from '~/components/Button/Button.vue'
import AlbumHeading from '~/components/AlbumHeading.vue'
import TrackList from '~/components/TrackList/TrackList.vue'
import FloatModal from '~/components/FloatModal/FloatModal.vue'
import FloatModalItem from '~/components/FloatModal/FloatModalItem.vue'
import Modal from '~/components/Modal/Modal.vue'
import AppSlider from '~/components/AppSlider.vue'
import AlbumServices from '~/services/AlbumServices'
import CollectionServices from '~/services/CollectionServices'

export default defineComponent({
  components: {
    AlbumCoverArt,
    Button,
    AppPreloader,
    AlbumHeading,
    TrackList,
    FloatModal,
    FloatModalItem,
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

    const albumHead: ComputedRef<AlbumHeadProps> = computed(() => {
      const { title, artist, period, genre, description } = album.data
      return { title, artist, period, genre, description }
    })

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

    const fetchCollections = () => {
      CollectionServices.list()
        .then((result) => setCollections(result))
        .catch((ignore) => ignore)
    }

    const callCollectionsModal = () => {
      collections.isActive = true
      fetchCollections()
    }

    const setAlbumBooklet = (data: string[]) => {
      album.data.albumCoverArt = data
    }

    const fetchAlbumBooklet = () => {
      if (Array.isArray(album.data.albumCoverArt)) {
        isBookletModalActive.value = true
      } else if (album.data.albumCoverArt > 0) {
        isBookletModalActive.value = true

        AlbumServices.booklet(album.data._id, album.data.albumCoverArt)
          .then((result) => setAlbumBooklet(result))
          .catch((ignore) => ignore)
      }
    }

    const closeBookletModal = () => {
      isBookletModalActive.value = false
    }

    const createNewCollection = (title: string) => {
      collections.isFetched = false

      CollectionServices.create(title, album.data._id)
        .then((result) => {
          store.commit('setSnackbarMessage', result)
          fetchCollections()
        })
        .catch((ignore) => ignore)
    }

    const addOrRemoveFromCollection = (payload: IFloatModalCheckAction) => {
      CollectionServices.addRemove(collections.data, payload)
        .then((result) => {
          store.commit('setSnackbarMessage', result)
          fetchCollections()
        })
        .catch((ignore) => ignore)
    }

    const descriptionHandler = (description: string) => {
      if (typeof inputTimer.value === 'number') {
        clearTimeout(inputTimer.value)
        inputTimer.value = setTimeout(() => (
          AlbumServices.description(String(route.params.id), description)
        ), 1000)
      }
    }

    const setAlbumState = (data: IAlbumFull) => {
      album.data = data
      album.isFetched = true
    }

    const fetchAlbumEntry = () => {
      AlbumServices.album(String(route.params.id))
        .then((data) => {
          setAlbumState(data)
          store.commit('setPlayerPlaylist', data)
        })
        .catch((ignore) => ignore)
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
    }
  }
})

</script>
