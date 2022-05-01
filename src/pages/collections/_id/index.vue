<template>
  <section class="section">
    <transition name="fade">
      <AppPreloader
        v-if="!collection.isFetched"
        mode="light"
      />
    </transition>
      
    <transition-group name="flyUp">
      <CategoryHero
        v-if="collection.isFetched"
        :data="collection.data"
        :description="collectionDescription"
        slug="collections"
        @setUploadedImage="setUploadedImage"
      />

      <VueDraggableNext
        v-if="collection.isFetched"
        handle=".--drag"
        class="cardlist"
        tag="ul"
        v-bind="dragOptions"
        @end="orderChanged"
      >
        <CardWrapper
          v-for="album in collection.data.albums"
          :key="album._id"
          draggable
        >
          <CardAlbum :album="album.album" />
        </CardWrapper>
      </VueDraggableNext>
    </transition-group>
  </section>
</template>

<script lang="ts">

import { computed, defineComponent, onMounted, reactive } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'
import { key } from '~/store'
import { CollectionPageItem } from '~/types/Collection'
import { DraggableEvent, ReorderPayload, UploadImageResult } from '~/types/Global'
import { VueDraggableNext } from 'vue-draggable-next'
import CollectionServices from '~/services/CollectionServices'
import AppPreloader from '~/components/Preloader/Preloader.vue'
import CategoryHero from '~/components/Hero/CategoryHero.vue'
import CardWrapper from '~/components/Cards/CardWrapper.vue'
import CardAlbum from '~/components/Cards/CardAlbum.vue'

export default defineComponent({
  components: {
    AppPreloader,
    VueDraggableNext,
    CategoryHero,
    CardWrapper,
    CardAlbum
  },

  setup() {
    const route = useRoute()
    const store = useStore(key)

    const collection = reactive({
      isFetched: false,
      data: {} as CollectionPageItem
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

      CollectionServices.reorder(payload)
        .then((message) => store.commit('setSnackbarMessage', { message, type: 'success' }))
        .catch((error) => console.dir(error))
    }

    const setCollection = (data: CollectionPageItem) => {
      collection.data = data
      collection.isFetched = true
    }

    const setUploadedImage = (payload: UploadImageResult) => {
      collection.data[payload.key] = payload.url
    }

    const fetchCollection = () => {
      CollectionServices.single(String(route.params.id))
        .then((response) => setCollection(response))
        .catch((error) => console.dir(error))
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
