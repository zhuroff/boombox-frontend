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
        <ul>
          <li v-for="item in albums.data" :key="item._id">
            <img :src="item.albumCover" alt="Well">
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
</style>
