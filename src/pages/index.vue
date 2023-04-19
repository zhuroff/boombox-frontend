<template>
  <section class="section">
    <transition name="fade">
      <AppPreloader v-if="!albums.isFetched" mode="light" />
    </transition>

    <transition-group name="flyUp">
      <div class="hero" key="hero">
        <div v-if="albums.isFetched" class="hero__wrapper">
          HERO SECTION
        </div>
      </div>

      <div v-if="albums.isFetched" key="events">
        <ul class="masonry">
          <li v-for="album in albums.data" :key="album._id" class="masonry__item">
            <router-link class="masonry__link" :to="{ path: `/albums/${album._id}` }">
              <img class="masonry__image" :src="album.albumCover" :alt="album.title">
              <div class="masonry__caption">
                <div class="masonry__caption-heading">{{ album.title }}</div>
                <div class="masonry__caption-description">
                  by {{ album.artist.title }}, {{ album.period.title }}. {{ album.genre.title }}
                </div>
              </div>
            </router-link>
          </li>
        </ul>
      </div>
    </transition-group>
  </section>
</template>
  
<script lang="ts">

import { defineComponent, onMounted, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { AlbumItemProps } from '~/types/Album'
import AlbumServices from '../services/IndexServices'
import AppPreloader from '~/components/Preloader/Preloader.vue'
import CardWrapper from '~/components/Cards/CardWrapper.vue'
import Pagination from '~/components/Pagination/Pagination.vue'

export default defineComponent({
  components: {
    AppPreloader,
    CardWrapper,
    Pagination
  },

  setup() {
    const route = useRoute()
    const router = useRouter()

    const albums = reactive<AlbumItemProps>({
      isFetched: false,
      data: []
    })

    const getRandomAlbums = () => {
      AlbumServices.getRandomAlbums()
        .then((data) => {
          albums.data = data
          albums.isFetched = true
        })
        .catch((error) => console.error(error))
    }

    onMounted(() => {
      getRandomAlbums()
    })

    return {
      albums
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

  &__item {

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

    img {
      display: block;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  &__link {
    position: relative;
    overflow: hidden;
    display: block;

    &:hover {
      .masonry__caption {
        opacity: 1;
        transform: translateY(0);
        transition: all 0.5s $animation;

        &-heading {
          opacity: 1;
          transform: translateY(0);
          transition: all 0.75s $animation;
        }

        &-description {
          opacity: 1;
          transform: translateY(0);
          transition: all 0.75s $animation;
        }
      }
    }
  }

  &__caption {
    position: absolute;
    z-index: 10;
    width: 100%;
    height: 100%;
    left: 0;
    bottom: 0;
    top: 0;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    padding: 0 5% 5%;
    opacity: 0;
    transform: translateY(25%);
    transition: all 0.5s $animation;
    background: linear-gradient(to top, $dark 25%, transparent 100%);

    &-heading {
      font-weight: 600;
      color: $white;
      opacity: 0;
      transform: translateY(50%);
      transition: all 0.75s $animation;
    }

    &-description {
      font-size: 70%;
      color: $border;
      opacity: 0;
      transform: translateY(10%);
      transition: all 0.75s $animation;
    }
  }
}
</style>
