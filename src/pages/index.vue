<template>
  <section class="section">
    <transition name="fade">
      <Preloader v-if="!isDataFetched" mode="light" />
    </transition>
    <transition-group name="flyUp">
      <div v-if="isDataFetched" key="events">
        <ul class="masonry">
          <Card
            v-for="card in tileList"
            :key="card._id"
            :card="card"
            type="CardTile"
            rootPath="albums"
            className="card-tile"
          />
        </ul>
      </div>
    </transition-group>
  </section>
</template>
  
<script lang="ts">
import { defineComponent, onMounted, reactive, computed, ref } from 'vue'
import { AlbumItem } from '~/types/Album'
import { CardBasic, ListPageResponse, RequestConfig } from '~/types/Common'
import DBApiService from '~/services/DBApiService'
import Preloader from '~/components/Preloader.vue'
import Card from '~/components/Cards/Card.vue'

export default defineComponent({
  components: {
    Preloader,
    Card
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

    const tileList = computed<CardBasic[]>(() => (
      albums.map((album) => ({
        _id: album._id,
        title: album.title,
        coverURL: `${album.coverURL}`,
        caption: `${album.artist.title } / ${album.period.title} / ${album.genre.title}`,
      }))
    ))

    const getRandomAlbums = () => {
      DBApiService.getEntityList<ListPageResponse<AlbumItem>>(requestConfig, 'albums')
        .then(({ docs }) => {
          albums.push(...docs)
          isDataFetched.value = true
        })
        .catch(console.error)
    }

    onMounted(getRandomAlbums)

    return {
      tileList,
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
