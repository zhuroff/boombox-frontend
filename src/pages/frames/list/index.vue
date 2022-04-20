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
          key="heading"
          class="section__heading"
        >
          <h1 class="section__title">There are {{ albums.pagination.totalDocs }} frames in your collection</h1>

          <Button
            text="Add new frame"
            :onClick="frameModalSwitcher"
          />
        </div>
        
        <ul
          key="list"
          v-if="albums.isFetched"
          class="cardlist"
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
          key="pagination"
          v-if="albums.isFetched && albums.pagination.totalPages > 1"
          :pagination="albums.pagination"
          @switchPagination="switchPagination"
        />
      </transition-group>

      <transition name="fade">
        <Modal
          v-if="isCreatingFrameModalActive"
          :isModalActive="isCreatingFrameModalActive"
          @closeModal="frameModalSwitcher"
        >
          <FrameForm @addNewFrame="addNewFrame" />
        </Modal>
      </transition>

      
    </div>
  </section>
</template>

<script lang="ts">

import {
  defineComponent,
  onMounted,
  ref,
  reactive,
} from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { TPagination, RequestConfig } from '~/types/Global'
import { FrameAlbumResponse, FrameAlbum } from '~/types/Frame'
import { CategoryKeys } from '~/types/Category'
import { useStore } from 'vuex'
import { key } from '~/store'
import AppPreloader from '~/components/Preloader/Preloader.vue'
import Button from '~/components/Button/Button.vue'
import AppSprite from '~/components/AppSprite.vue'
import CardWrapper from '~/components/Cards/CardWrapper.vue'
import CardFrame from '~/components/Cards/CardFrame.vue'
import AppPagination from '~/components/AppPagination.vue'
import Modal from '~/components/Modal/Modal.vue'
import FrameForm from '~/components/Frame/FrameForm.vue'
import FrameServices from '~/services/FrameServices'

export default defineComponent({
  components: {
    AppPreloader,
    Button,
    AppSprite,
    CardWrapper,
    CardFrame,
    AppPagination,
    Modal,
    FrameForm
  },

  setup() {
    const store = useStore(key)
    const router = useRouter()
    const route = useRoute()

    const pageConfig = reactive<RequestConfig>({
      page: Number(route.query.p) || 1,
      sort: { title: 1 },
      limit: 40
    })

    const albums = reactive({
      isFetched: false,
      data: [] as FrameAlbum[],
      pagination: {} as TPagination
    })

    const isCreatingFrameModalActive = ref(false)

    const newAlbumTitle = ref('')
    const newAlbumFrame = ref('')

    const frameModalSwitcher = () => {
      isCreatingFrameModalActive.value = !isCreatingFrameModalActive.value
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

    const addNewFrame = (frame: FrameAlbum) => {
      albums.data.unshift(frame)
      albums.pagination.totalDocs += 1

      store.commit('setSnackbarMessage', {
        message: 'Album successfully added to collection',
        type: 'success'
      })

      frameModalSwitcher()
    }

    const setFramesAlbums = (data: FrameAlbumResponse) => {
      albums.isFetched = true
      albums.pagination = data.pagination
      albums.data = data.docs
    }

    const fetchFrameAlbums = async () => {
      FrameServices.list(pageConfig)
        .then((data) => setFramesAlbums(data))
        .catch((error) => console.dir(error))
    }

    const deleteFrameAlbum = async (id: string) => {
      const targetAlbumIndex = albums.data.findIndex((el) => el._id === id)
      let deletedFrame

      if (targetAlbumIndex > -1) {
        deletedFrame = albums.data.splice(targetAlbumIndex, 1)
      }

      if (deletedFrame) {
        const payload: CategoryKeys = {
          artist: deletedFrame[0].artist._id,
          genre: deletedFrame[0].genre._id,
          period: deletedFrame[0].period._id
        }

        FrameServices.remove(id, payload)
          .then((response) => {
            store.commit('setSnackbarMessage', {
              message: response.message,
              type: 'success'
            })
          })
          .catch((error) => console.dir(error))
      }
    }

    onMounted(() => {
      if (!route.query.p) {
        changeRoutePage(pageConfig.page)
      }

      fetchFrameAlbums()
    })

    return {
      albums,
      deleteFrameAlbum,
      isCreatingFrameModalActive,
      newAlbumTitle,
      newAlbumFrame,
      frameModalSwitcher,
      switchPagination,
      addNewFrame
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
