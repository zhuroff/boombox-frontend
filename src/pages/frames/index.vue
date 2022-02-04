<template>
  <section class="section">
    <transition name="fade">
      <AppPreloader
        v-if="!albums.isFetched"
        mode="light"
      />
    </transition>

    <div id="scrollspace">
      <transition-group name="flyUp">
        <div
          class="section__heading"
          key="heading"
        >
          <h1 class="section__title">There are {{ albums.pagination.totalDocs }} frames in your collection</h1>

          <Button
            text="Add new frame"
            :onClick="callFrameCreatingModal"
          />
        </div>
        
        <ul
          v-if="albums.isFetched"
          class="cardlist"
          key="list"
        >
          <CardWrapper
            v-for="album in albums.data"
            :key="album._id"
            deletable
            @deleteItem="deleteFrameAlbum(album._id)"
          >
            <CardFrame :album="album" />
          </CardWrapper>
        </ul>

        <AppPagination
          v-if="albums.isFetched && albums.pagination.totalPages > 1"
          :pagination="albums.pagination"
          key="pagination"
          @switchPagination="switchPagination"
        />
      </transition-group>

      <transition name="fade">
        <Modal
          v-if="isCreatingFrameModalActive"
          :isModalActive="isCreatingFrameModalActive"
          @closeModal="closeCreatingModalFrame"
        >
          <FrameForm />
        </Modal>
      </transition>

      
    </div>
  </section>
</template>

<script lang="ts">

import {
  defineComponent,
  onMounted,
  Ref,
  ref,
  reactive,
  watchEffect
} from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { IPagination } from '~/types/Global'
import { IFrameBasic } from '~/types/Frame'
import AppPreloader from '~/components/Preloader/Preloader.vue'
import Button from '~/components/Button/Button.vue'
import AppSprite from '~/components/AppSprite.vue'
// import AppInput from '~/components/AppInput.vue'
import CardWrapper from '~/components/Cards/CardWrapper.vue'
import CardFrame from '~/components/Cards/CardFrame.vue'
import AppPagination from '~/components/AppPagination.vue'
import Modal from '~/components/Modal/Modal.vue'
import FrameForm from '~/components/Frame/FrameForm.vue'
import api from '~/api'

export default defineComponent({
  components: {
    AppPreloader,
    Button,
    AppSprite,
    // AppInput,
    CardWrapper,
    CardFrame,
    AppPagination,
    Modal,
    FrameForm
  },

  setup() {
    const router = useRouter()
    const route = useRoute()

    const searchTimer: Ref<ReturnType<typeof setTimeout> | number> = ref(0)
    const searchResults = ref(null)

    const pageConfig = reactive({
      page: Number(route.query.p) || 1,
      sort: { title: 1 },
      limit: 40
    })

    const albums = reactive({
      isFetched: false,
      data: [] as IFrameBasic[],
      pagination: {} as IPagination
    })

    const isCreatingFrameModalActive = ref(false)
    const categorySearchQuery = ref('')

    const newAlbumTitle = ref('')
    const newAlbumFrame = ref('')
    

    const deleteFrameAlbum = async (id: string) => {
      try {
        const targetAlbumIndex = albums.data.findIndex((el) => el._id === id)
        let albumGhost

        if (targetAlbumIndex > -1) {
          albumGhost = albums.data.splice(targetAlbumIndex, 1)
        }

        if (albumGhost) {
          const payload = {
            artist: albumGhost[0].artist._id,
            genre: albumGhost[0].genre._id,
            period: albumGhost[0].period._id
          }

          const response = await api.post(`/api/frames/${id}/delete`, payload)
          console.log(response)
        }
      } catch (error) {
        console.error(error)
      }
    }

    const closeCreatingModalFrame = () => {
      isCreatingFrameModalActive.value = false
      categorySearchQuery.value = ''
      searchResults.value = null
      newAlbumTitle.value = ''
      newAlbumFrame.value = ''
    }

    const submitForm = async () => {
      const payload = {
        title: newAlbumTitle.value,
        iframe: newAlbumFrame.value
      }

      try {
        const response = await api.post('/api/frames/create', payload)

        albums.data.unshift(response.data)
        closeCreatingModalFrame()
      } catch (error) {
        throw error
      }
    }

    const callFrameCreatingModal = () => {
      isCreatingFrameModalActive.value = true
    }

    const closeCategoryList = () => {
      categorySearchQuery.value = ''
      searchResults.value = null
    }

    const fetchSearchedCategory = async (query: string) => {
      // try {
      //   const payload = {
      //     query,
      //     key: categoryKey.value
      //   }

      //   const response = await api.post('/api/search', payload)
      //   searchResults.value = response.data
      // } catch (error) {
      //   throw error
      // }
    }

    const searchCategory = (event: any) => {
      if (typeof searchTimer.value === 'number') {
        clearTimeout(searchTimer.value)
        searchTimer.value = setTimeout(() => {
          fetchSearchedCategory(event?.target?.value)
        }, 1000)
      }
    }

    const chooseCategory = (item: any) => {
      console.log(item)
      // if (categoryKey.value === 'artists') {
      //   newAlbumArtist.id = item._id
      //   newAlbumArtist.title = item.title
      // }

      // if (categoryKey.value === 'genres') {
      //   newAlbumGenre.id = item._id
      //   newAlbumGenre.title = item.title
      // }

      // if (categoryKey.value === 'periods') {
      //   newAlbumYear.id = item._id
      //   newAlbumYear.title = item.title
      // }

      closeCategoryList()
    }

    const createNewCategory = async () => {
      // const payload = {
      //   category: categoryKey.value,
      //   value: categorySearchQuery.value
      // }

      // try {
      //   const response = await api.post('/api/synchronize/create', payload)
      //   chooseCategory(response.data)
      // } catch (error) {
      //   console.error(error)
      // }
    }

    const clearfyFramesList = () => {
      albums.isFetched = false
      albums.data = []
    }

    const switchPagination = (value: number) => {
      pageConfig.page = value

      clearfyFramesList()
      changeRoutePage(value)
      fetchFrameAlbums()
    }

    const changeRoutePage = (value: number) => {
      router.push({ query: { p: value } })
    }

    const setFramesAlbums = (data: { docs: IFrameBasic[], pagination: IPagination }) => {
      albums.isFetched = true
      console.log(data)

      if (data) {
        albums.pagination = data.pagination
        albums.data = data.docs
      }
    }

    const fetchFrameAlbums = async () => {
      try {        
        const response = await api.post('/api/frames', pageConfig)
        
        if (response?.status === 200) {
          setFramesAlbums(response.data)
        }
      } catch (error) {
        throw error
      }
    }

    onMounted(() => {
      if (!route.query.p) {
        changeRoutePage(pageConfig.page)
      }

      fetchFrameAlbums()
    })

    watchEffect(() => {
      // if (isCreatingFrameModalActive.value) {
      //   document.querySelector('.header')?.classList.add('--z-low')
      //   document.querySelector('.player')?.classList.add('--z-low')
      // } else {
      //   document.querySelector('.header')?.classList.remove('--z-low')
      //   document.querySelector('.player')?.classList.remove('--z-low')
      // }
    })

    return {
      albums,
      deleteFrameAlbum,
      isCreatingFrameModalActive,
      newAlbumTitle,
      newAlbumFrame,
      submitForm,
      callFrameCreatingModal,
      closeCreatingModalFrame,
      closeCategoryList,
      categorySearchQuery,
      searchCategory,
      searchResults,
      chooseCategory,
      createNewCategory,
      switchPagination
    }
  }
})

</script>

<style lang="scss" scoped>

@import '~/scss/variables';

.frames {

  &__form-wrapper {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100vw;
    height: 100vh;
    padding: 50px 25px;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 5000;
    background-color: rgba(0, 0, 0, 0.75);
  }

  &__form-close {
    @include buttonClose;
  }

  &__form {
    background-color: $white;
    flex: none;
    width: calc(100vw - 40px);
    max-width: 500px;
    border-radius: 5px;
    padding: 25px;
    position: relative;
    overflow: hidden;

    &-button {
      margin-bottom: 5px;
      display: block;
      width: 100%;
      height: 35px;
      border: 1px solid $pale;
      background-color: $border;
      outline: none;
    }

    &-submit {
      height: 35px;
      border-radius: 3px;
      border: 1px solid $dark;
      background-color: $dark;
      color: $white;
      outline: none;
      float: right;
      padding: 0 20px;
    }
  }

  &__categories {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: $white;
    padding: inherit;
    
    &-close {
      position: absolute;
      padding: 0;
      background-color: transparent;
      border: 0;
      z-index: 10;
      width: 15px;
      height: 15px;
      top: 15px;
      right: 15px;

      .icon-delete {
        fill: $dark;
      }
    }

    &-title {
      font-weight: 600;
      margin-bottom: 16px;

      &::first-letter {
        text-transform: uppercase;
      }
    }

    &-list {
      margin-top: 10px;
    }

    &-item {

      label {
        cursor: pointer;
        display: flex;
        align-items: center;
        padding: 10px 10px;
        position: relative;
        border-radius: 5px;

        &:hover {
          background-color: $border;
        }

        input {
          opacity: 0;
          width: 0;
          height: 0;
          position: absolute;
          top: 0;
          left: 0;
          outline: none;
        }

        span {
          font-weight: 600;
          font-size: 14px;
        }
      }
    }
  }
}

</style>
