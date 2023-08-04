<template>
  <section class="section">
    <transition name="fade">
      <AppPreloader
        v-if="!isDataFetched"
        mode="light"
      />
    </transition>
    <Header :heading="pageHeading" noSearch>
      <slot name="header"></slot>
    </Header>
    <transition name="flyUp">
      <div v-if="isDataFetched" class="album">
        <div class="album__aside">
          <div class="album__sidebar">
            <CoverArt
              :albumCover="album.albumCover"
              @coverClick="getBooklet"
            />
          </div>
        </div>
      </div>
    </transition>
  </section>
</template>

<script lang="ts">
import { PropType, defineComponent } from 'vue'
import { AlbumPage } from '~/types/Album';
import AppPreloader from '~/components/Preloader/Preloader.vue'
import Header from '~/components/Header/Header.vue'
import CoverArt from '~/components/CoverArt/CoverArt.vue';

export default defineComponent({
  name: 'AlbumPageTemplate',
  components: {
    AppPreloader,
    Header,
    CoverArt
  },
  props: {
    isDataFetched: {
      type: Boolean,
      required: true
    },
    pageHeading: {
      type: String,
      required: true
    },
    album: {
      type: Object as PropType<AlbumPage>,
      required: true
    },
    getBooklet: {
      type: Function as PropType<() => void>,
      required: true
    }
  }
})
</script>
