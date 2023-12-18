<template>
  <section class="section">
    <transition name="fade">
      <Preloader
        v-if="!collection.isFetched"
        mode="light"
      />
    </transition>
      
    <transition-group name="flyUp">
      <!-- <CategoryHero
        v-if="collection.isFetched"
        :data="collection.data"
        :description="collectionDescription"
        slug="collections"
        @setUploadedImage="setUploadedImage"
      /> -->

      <VueDraggableNext
        v-if="collection.isFetched"
        handle=".--drag"
        class="cardlist"
        tag="ul"
        v-bind="dragOptions"
        @end="orderChanged"
      >
        <!-- <CardWrapper
          v-for="album in collection.data.albums"
          :key="album._id"
          draggable
        >
          <CardAlbum :album="album.album" />
        </CardWrapper> -->
      </VueDraggableNext>
    </transition-group>
  </section>
</template>

<script lang="ts">

import { computed, defineComponent, onMounted, reactive } from 'vue'
import { useRoute } from 'vue-router'
// import { CollectionPageItem } from '~/types/Collection'
import { DraggableEvent, ReorderPayload, UploadImageResult } from '~/types/Common'
import { VueDraggableNext } from 'vue-draggable-next'
import Preloader from '~/components/Preloader.vue'
import CategoryHero from '~/components/CategoryHero.vue'
// import CardWrapper from '~/components/Cards/CardWrapper.vue'
// import CardAlbum from '~/components/Cards/CardAlbum.vue'

export default defineComponent({
  components: {
    Preloader,
    VueDraggableNext,
    CategoryHero,
    // CardWrapper,
    // CardAlbum
  },

  setup() {
    const route = useRoute()

    const collection = reactive({
      isFetched: false,
      data: {} as any // CollectionPageItem
    })

    const dragOptions = reactive({
      animation: 300,
      disabled: false
    })

    const collectionDescription = computed(() => (
      `Albums in collection: ${collection.data.albums?.length}`
    ))

    const orderChanged = (event: DraggableEvent) => {
      const payload: ReorderPayload = {
        entityID: collection.data._id,
        oldOrder: event.oldIndex,
        newOrder: event.newIndex
      }

      // collectionServices.reorder(payload)
      //   .then((message) => store.commit('setSnackbarMessage', { message, type: 'success' }))
      //   .catch((error) => console.dir(error))
    }

    const setCollection = (data: any /* CollectionPageItem */) => {
      collection.data = data
      collection.isFetched = true
    }

    const setUploadedImage = (payload: UploadImageResult) => {
      collection.data[payload.key] = payload.url
    }

    const fetchCollection = () => {
      // collectionServices.single(String(route.params.id))
      //   .then((response) => setCollection(response))
      //   .catch((error) => console.dir(error))
    }

    onMounted(() => fetchCollection())

    return {
      collection,
      dragOptions,
      orderChanged,
      setUploadedImage,
      collectionDescription
    }
  }
})

</script>
