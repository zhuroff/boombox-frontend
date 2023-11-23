<template>

<section class="section">
  <transition name="fade">
    <Preloader
      v-if="!album.isFetched"
      mode="light"
    />
  </transition>

  <transition name="flyUp">
    <div
      v-if="album.isFetched"
      class="album --frame"
    >
      <div
        class="album__frame"
        v-html="album.data.frame"
      ></div>
    </div>
  </transition>
</section>

</template>

<script lang="ts">

import { defineComponent, reactive, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { FrameAlbum } from '~/types/Frame'
import FrameServices from '~/services/FrameServices'
import Preloader from '~/components/Preloader.vue'

export default defineComponent({
  components: {
    Preloader
  },

  setup() {
    const route = useRoute()

    const album = reactive({
      isFetched: false,
      data: {} as FrameAlbum
    })

    const setAlbumState = (data: FrameAlbum) => {
      album.isFetched = true
      album.data = data
    }

    const fetchFrame = async () => {
      FrameServices.single(String(route.params.id))
        .then((frame) => setAlbumState(frame))
        .catch((error) => console.dir(error))
    }

    onMounted(() => fetchFrame())

    return {
      album
    }
  }
})

</script>

<style lang="scss" scoped>

@import '~/scss/variables';
@import 'include-media';

.album {

  &.--frame {

    @include media('<laptop') {
      background: linear-gradient(to right, #0f1e36, #e5e5e5, #0f1e36);

      @include media('landscape') {
        padding: 25px 0;
      }
    }
  }

  &__heading {

    @include media('<laptop') {
      display: none;
    }

    @include media('>=laptop') {
      flex: 1 1 0;
      padding-left: 25px;
    }
  }

  &__frame {

    @include media('<laptop', 'landscape') {
      max-width: 400px;
      margin: 0 auto;
    }
  }
}

</style>
