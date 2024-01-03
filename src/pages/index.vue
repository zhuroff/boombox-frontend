<template>
  <section class="section">
    <transition name="fade">
      <Preloader v-if="!isDataFetched" mode="light" />
    </transition>
    <transition-group name="flyUp">
      <div v-if="isDataFetched" key="events">
        <ul class="masonry">
          <AdapterCard
            v-for="card in albums"
            :key="card._id"
            :card="card"
            placeholderImage="/img/album.webp"
          />
        </ul>
      </div>
    </transition-group>
  </section>
</template>
  
<script lang="ts">
import { defineComponent, onMounted, reactive, ref } from 'vue'
import { RequestConfig } from '~/types/Common'
import { AlbumItemRes, ListPageResponse } from '~/types/ReqRes'
import AlbumItem from '~/classes/AlbumItem'
import dbServices from '~/services/database.services'
import Preloader from '~/components/Preloader.vue'
import AdapterCard from '~/components/Cards/AdapterCard.vue'

export default defineComponent({
  components: {
    Preloader,
    AdapterCard
  },

  setup() {
    const albums = reactive<AlbumItem[]>([])
    const isDataFetched = ref(false)

    const requestConfig = reactive<RequestConfig>({
      page: 1,
      limit: 11,
      isRandom: true,
      sort: { title: 1 }
    })

    const getRandomAlbums = () => {
      dbServices.getEntityList<ListPageResponse<AlbumItemRes>>(requestConfig, 'albums')
        .then(({ docs }) => {
          albums.push(...docs.map((doc) => new AlbumItem(doc, 'CardTile', 'albums')))
          isDataFetched.value = true
        })
        .catch(console.error)
    }

    onMounted(getRandomAlbums)

    return {
      albums,
      isDataFetched
    }
  }
})
</script>

<style lang="scss" scoped>
@import '~/scss/variables';
@import 'include-media';
.masonry {
  display: grid;
  grid-template-columns: 50% 25% 12.5% 12.5%;

  .card-tile {

    &:nth-child(1) {
      grid-row: 1 / span 4;
      font-size: 300%;
    }

    &:nth-child(2) {
      grid-row: 1 / span 2;
      font-size: 175%;
    }

    &:nth-child(3) {
      grid-row: 3 / span 2;
      font-size: 175%;
    }

    &:nth-child(n+4) {
      font-size: 125%;
    }

    &:nth-child(4) {
      grid-row: 1;
      grid-column: 3;
    }

    &:nth-child(5) {
      grid-row: 1;
      grid-column: 4;
    }

    &:nth-child(6) {
      grid-row: 2;
      grid-column: 3;
    }

    &:nth-child(7) {
      grid-row: 2;
      grid-column: 4;
    }

    &:nth-child(8) {
      grid-row: 3;
      grid-column: 3;
    }

    &:nth-child(9) {
      grid-row: 3;
      grid-column: 4;
    }

    &:nth-child(10) {
      grid-row: 4;
      grid-column: 3;
    }

    &:nth-child(11) {
      grid-row: 4;
      grid-column: 4;
    }
  }
}
</style>
