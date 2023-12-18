<template>
  <section class="section">
    <!-- <transition name="fade">
      <Preloader
        v-if="!albums.isFetched"
        mode="light"
      />
    </transition>
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
      <Paginator
        key="pagination"
        v-if="albums.isFetched && albums.pagination.totalPages > 1"
        :pagination="albums.pagination"
        :config="{}"
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
    </transition> -->
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
// import { Pagination, RequestConfig } from '~/types/Common'
// import { FrameAlbumResponse, FrameAlbum } from '~/types/Frame'
// import { CategoryKeys } from '~/types/Category'
// import Preloader from '~/components/Preloader.vue'
// import Button from '~/components/Button/Button.vue'
// import CardWrapper from '~/components/Cards/CardWrapper.vue'
// import CardFrame from '~/components/Cards/CardFrame.vue'
// import Paginator from '~/components/Paginator.vue'
// import Modal from '~/components/Modal.vue'

export default defineComponent({
  // components: {
  //   Preloader,
  //   Button,
  //   CardWrapper,
  //   CardFrame,
  //   Paginator,
  //   Modal
  // },
  setup() {
    const router = useRouter()
    const route = useRoute()

    // const pageConfig = reactive<RequestConfig>({
    //   page: Number(route.query.p) || 1,
    //   sort: { title: 1 },
    //   limit: 40
    // })

    // const albums = reactive({
    //   isFetched: false,
    //   data: [] as FrameAlbum[],
    //   pagination: {} as Pagination
    // })

    // const isCreatingFrameModalActive = ref(false)

    // const frameModalSwitcher = () => {
    //   isCreatingFrameModalActive.value = !isCreatingFrameModalActive.value
    // }

    // const clearfyFramesList = () => {
    //   albums.isFetched = false
    //   albums.data = []
    // }

    // const switchPagination = (value: number) => {
    //   pageConfig.page = value

    //   clearfyFramesList()
    //   changeRoutePage(value)
    //   fetchFrameAlbums()
    // }

    // const changeRoutePage = (value: number) => {
    //   router.push({ query: { p: value } })
    // }

    // const addNewFrame = (frame: FrameAlbum) => {
    //   albums.data.unshift(frame)
    //   albums.pagination.totalDocs += 1

    //   store.commit('setSnackbarMessage', {
    //     message: 'Album successfully added to collection',
    //     type: 'success'
    //   })

    //   frameModalSwitcher()
    // }

    // const setFramesAlbums = (data: FrameAlbumResponse) => {
    //   albums.isFetched = true
    //   albums.pagination = data.pagination
    //   albums.data = data.docs
    // }

    // const fetchFrameAlbums = async () => {
    //   // FrameServices.list(pageConfig)
    //   //   .then((data) => setFramesAlbums(data))
    //   //   .catch((error) => console.dir(error))
    // }

    // const deleteFrameAlbum = async (id: string) => {
    //   const targetAlbumIndex = albums.data.findIndex((el) => el._id === id)
    //   let deletedFrame

    //   if (targetAlbumIndex > -1) {
    //     deletedFrame = albums.data.splice(targetAlbumIndex, 1)
    //   }

    //   if (deletedFrame) {
    //     const payload: CategoryKeys = {
    //       artist: deletedFrame[0].artist._id,
    //       genre: deletedFrame[0].genre._id,
    //       period: deletedFrame[0].period._id
    //     }

    //     // FrameServices.remove(id, payload)
    //     //   .then((response) => {
    //     //     store.commit('setSnackbarMessage', {
    //     //       message: response.message,
    //     //       type: 'success'
    //     //     })
    //     //   })
    //     //   .catch((error) => console.dir(error))
    //   }
    // }

    // onMounted(() => {
    //   if (!route.query.p) {
    //     changeRoutePage(pageConfig.page)
    //   }

    //   fetchFrameAlbums()
    // })

    return {
      // albums,
      // deleteFrameAlbum,
      // isCreatingFrameModalActive,
      // frameModalSwitcher,
      // switchPagination,
      // addNewFrame
    }
  }
})

</script>

<style lang="scss" scoped>

@import '~/scss/variables';
@import 'include-media';

@include media('<laptop') {

  .section {

    &__heading {

      .button {
        position: fixed;
        bottom: 25px;
        right: 25px;
        width: 101px;
        z-index: 10;
      }
    }
  }
}

</style>
