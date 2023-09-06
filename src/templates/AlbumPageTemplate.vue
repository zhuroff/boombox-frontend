<template>
  <section class="section">
    <transition name="fade">
      <AppPreloader
        v-if="!isDataFetched"
        mode="light"
      />
    </transition>
    <transition name="flyUp">
      <div v-if="isDataFetched" class="album">
        <div class="album__grid">
          <!-- <div class="album__sidebar"> -->
            <CoverArt
              :albumCover="album.albumCover"
              @coverClick="getBooklet"
            />
          <!-- </div> -->
          <div class="album__info">
            
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
import CoverArt from '~/components/CoverArt/CoverArt.vue';

export default defineComponent({
  name: 'AlbumPageTemplate',
  components: {
    AppPreloader,
    CoverArt
  },
  props: {
    isDataFetched: {
      type: Boolean,
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

<style lang="scss">
@import '../scss/variables.scss';
@import 'include-media';

.album {
  flex: 1 1 0;
  position: relative;

  @include media('>=laptop') {
    padding: 25px;
  }

  &__grid {

    @include media('<laptop') {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vw;
    }

    @include media('>=laptop') {
      position: relative;
      display: grid;
      grid-template-columns: 230px 1fr;
    }
  }
}
</style>
