<template>
  <section class="section">
    <transition name="fade">
      <AppPreloader
        v-if="!collection.isFetched"
        mode="light"
      />
    </transition>
      
    <div id="scrollspace">
      <transition-group name="flyUp">
        <CollectionHero
          v-if="collection.isFetched"
          :collection="collection.data"
          @setCollectionImage="setCollectionImage"
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
    </div>
  </section>
</template>

<script lang="ts">

import { defineComponent, onMounted, reactive } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'
import { key } from '~/store'
import { CollectionPageItem, ReorderPayload } from '~/types/Collection'
import { IDraggableEvent } from '~/types/Global'
import { VueDraggableNext } from 'vue-draggable-next'
import CollectionServices from '~/services/CollectionServices'
import AppPreloader from '~/components/Preloader/Preloader.vue'
import CollectionHero from '~/components/Hero/CollectionHero.vue'
import CardWrapper from '~/components/Cards/CardWrapper.vue'
import CardAlbum from '~/components/Cards/CardAlbum.vue'

export default defineComponent({
  components: {
    AppPreloader,
    VueDraggableNext,
    CollectionHero,
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

    const orderChanged = (event: IDraggableEvent) => {
      const payload: ReorderPayload = {
        collectionID: collection.data._id,
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

    const setCollectionImage = (payload: any) => {
      console.log(payload)
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
      setCollectionImage
    }
  }
})

</script>
