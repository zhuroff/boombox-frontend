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
          <AlbumInfo
            :title="album.title"
            :artist="album.artist"
            :genre="album.genre"
            :period="album.period"
            :entityType="entityType"
            :totalCounts="totalCounts"
            :getRandomAlbum="getRandomAlbum"
          />
        </div>
      </div>
    </transition>
  </section>
</template>

<script lang="ts">
import { PropType, defineComponent, computed } from 'vue'
import { AlbumPage } from '~/types/Album';
import AppPreloader from '~/components/Preloader/Preloader.vue'
import CoverArt from '~/components/CoverArt/CoverArt.vue';
import AlbumInfo from '~/components/AlbumInfo.vue';

export default defineComponent({
  name: 'AlbumPageTemplate',
  components: {
    AppPreloader,
    CoverArt,
    AlbumInfo
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
    entityType: {
      type: String,
      required: true
    },
    getBooklet: {
      type: Function as PropType<() => void>,
      required: true
    },
    getRandomAlbum: {
      type: Function as PropType<() => void>,
      required: true
    }
  },
  setup({ album }) {
    const totalCounts = computed(() => (
      `${album.tracks?.length || 0} songs, ${album.tracks?.reduce((acc, next) => (
        acc + Number(next.duration) || 0
      ), 0) || '0 min 0 sec'}`
    ))

    return { totalCounts }
  }
})
</script>

<style lang="scss">
@import '../scss/variables.scss';
@import 'include-media';

.album {
  flex: 1 1 0;
  position: relative;

  &:after {
    content: '';
    position: absolute;
    width: 100%;
    height: 265px;
    background-color: $dark;
    left: 0;
    top: 0;
    z-index: -1;
  }

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
      grid-template-columns: 300px 1fr;
    }
  }
}
</style>
