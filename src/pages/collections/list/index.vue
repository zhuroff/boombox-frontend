<template>
  <!-- <section class="section">
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
  </section> -->
  <section class="section"></section>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive } from 'vue'
// import { CollectionListItem } from '~/types/Collection'
// import collectionServices from '~/services/collection.services'
import Preloader from '~/components/Preloader.vue'
// import CardWrapper from '~/components/Cards/CardWrapper.vue'
// import CardCollection from '~/components/Cards/CardCollection.vue'
import { useListPage } from '~/hooks/useListPage'
import { Compilation } from '~/types/Compilation'
import { CollectionEntityRes } from '~/types/ReqRes'
import CollectionEntity from '~/classes/CollectionEntity'

// type CollectionsPage = {
//   isFetched: boolean
//   data: CollectionListItem[] 
// }

export default defineComponent({
  components: {
    Preloader,
    // CardWrapper,
    // CardCollection
  },
  setup() {
    const {
      fetchData,
      isDataFetched,
      pagePagination,
      pageStateConfig,
      switchPagination
    } = useListPage<CollectionEntityRes<string>, CollectionEntity<string>>(CollectionEntity)

    onMounted(() => {
      fetchData('collections')
        .then((payload) => console.log(payload))
    })

    // const collections = reactive<CollectionsPage>({
    //   isFetched: false,
    //   data: []
    // })

    // const setCollectionList = (data: CollectionListItem[]) => {
    //   collections.data = data
    //   collections.isFetched = true
    // }

    // const spliceCollection = (id: string) => {
    //   const deletedCollectionIndex = collections.data.findIndex((collection) => (
    //     collection._id === id
    //   ))

    //   if (deletedCollectionIndex > -1) {
    //     collections.data.splice(deletedCollectionIndex, 1)
    //   }
    // }

    // const fetchCollections = () => {
    //   collectionServices.list()
    //     .then((data) => setCollectionList(data))
    //     .catch((error) => console.dir(error))
    // }

    // const deleteCollection = (id: string) => {
    //   collectionServices.remove(id)
    //     .then((message) => store.commit('setSnackbarMessage', { message, type: 'success' }))
    //     .then(_ => spliceCollection(id))
    //     .catch((error) => console.dir(error))
    // }

    // onMounted(() => fetchCollections())

    return {
      // collections,
      // deleteCollection
    }
  }
})

</script>
