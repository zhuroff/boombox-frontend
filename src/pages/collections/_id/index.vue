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

        <ul
          v-if="collection.isFetched"
          class="cardlist"
        >
          <CardWrapper
            v-for="album in collection.data.albums"
            :key="album._id"
          >
            <CardAlbum :album="album.album" />
          </CardWrapper>
        </ul>
      </transition-group>
    </div>
  </section>
</template>

<script lang="ts">

import { defineComponent, onMounted, reactive } from 'vue'
import { useRoute } from 'vue-router'
import { CollectionPageItem } from '~/types/Collection'
import CollectionServices from '~/services/CollectionServices'
import AppPreloader from '~/components/Preloader/Preloader.vue'
import CollectionHero from '~/components/Hero/CollectionHero.vue'
import CardWrapper from '~/components/Cards/CardWrapper.vue'
import CardAlbum from '~/components/Cards/CardAlbum.vue'

export default defineComponent({
  components: {
    AppPreloader,
    CollectionHero,
    CardWrapper,
    CardAlbum
  },

  setup() {
    const route = useRoute()

    const collection = reactive({
      isFetched: false,
      data: {} as CollectionPageItem
    })

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
      setCollectionImage
    }
  }
})

</script>
