<template>
  <section class="section">
    <transition name="fade">
      <AppPreloader
        v-if="!collections.isFetched"
        mode="light"
      />
    </transition>

    <div id="scrollspace">
      <transition-group name="flyUp">
        <div
          class="section__heading"
          key="heading"
        >
          <h1 class="section__title">
            There are {{ collections.data.length }} lists in your collection
          </h1>
        </div>

        <ul
          v-if="collections.isFetched"
          class="cardlist"
          key="list"
        >
          <CardWrapper
            v-for="album in collections.data"
            :key="album._id"
          >
            <CardCollection
              :album="album"
              slug="collections"
            />
          </CardWrapper>
        </ul>
      </transition-group>
    </div>
  </section>
</template>

<script lang="ts">

import { defineComponent, onMounted, reactive } from 'vue'
import { CollectionListItem } from '~/types/Collection'
import CollectionServices from '~/services/CollectionServices'
import AppPreloader from '~/components/Preloader/Preloader.vue'
import CardWrapper from '~/components/Cards/CardWrapper.vue'
import CardCollection from '~/components/Cards/CardCollection.vue'

export default defineComponent({
  components: {
    AppPreloader,
    CardWrapper,
    CardCollection
  },

  setup() {
    const collections = reactive({
      isFetched: false,
      data: [] as CollectionListItem[]
    })

    const setCollectionList = (data: CollectionListItem[]) => {
      collections.data = data
      collections.isFetched = true
    }

    const fetchCollections = () => {
      CollectionServices.list()
        .then((data) => setCollectionList(data))
        .catch((error) => console.dir(error))
    }

    onMounted(() => fetchCollections())

    return {
      collections
    }
  }
})

</script>
