<template>
  <section class="section">
    <transition name="fade">
      <Preloader
        v-if="!collections.isFetched"
        mode="light"
      />
    </transition>

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
          deletable
          @deleteItem="deleteCollection(album._id)"
        >
          <CardCollection
            :data="album"
            title="Albums in collection:"
            slug="collections"
          />
        </CardWrapper>
      </ul>
    </transition-group>
  </section>
</template>

<script lang="ts">

import { defineComponent, onMounted, reactive } from 'vue'
import { useStore } from 'vuex'
import { key } from '~/store'
import { CollectionListItem } from '~/types/Collection'
import CollectionServices from '~/services/CollectionServices'
import Preloader from '~/components/Preloader.vue'
import CardWrapper from '~/components/Cards/CardWrapper.vue'
import CardCollection from '~/components/Cards/CardCollection.vue'

type CollectionsPage = {
  isFetched: boolean
  data: CollectionListItem[] 
}

export default defineComponent({
  components: {
    Preloader,
    CardWrapper,
    CardCollection
  },

  setup() {
    const store = useStore(key)

    const collections = reactive<CollectionsPage>({
      isFetched: false,
      data: []
    })

    const setCollectionList = (data: CollectionListItem[]) => {
      collections.data = data
      collections.isFetched = true
    }

    const spliceCollection = (id: string) => {
      const deletedCollectionIndex = collections.data.findIndex((collection) => (
        collection._id === id
      ))

      if (deletedCollectionIndex > -1) {
        collections.data.splice(deletedCollectionIndex, 1)
      }
    }

    const fetchCollections = () => {
      CollectionServices.list()
        .then((data) => setCollectionList(data))
        .catch((error) => console.dir(error))
    }

    const deleteCollection = (id: string) => {
      CollectionServices.remove(id)
        .then((message) => store.commit('setSnackbarMessage', { message, type: 'success' }))
        .then(_ => spliceCollection(id))
        .catch((error) => console.dir(error))
    }

    onMounted(() => fetchCollections())

    return {
      collections,
      deleteCollection
    }
  }
})

</script>
