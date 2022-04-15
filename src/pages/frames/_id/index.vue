<template>

<div id="scrollspace">
  <div class="album" v-if="album">
    <div class="album__frame" v-html="album.frame"></div>
    <AlbumHeading
      :heading="frameHeading"
      @textInputHandler="saveFrameDescription"
    />
  </div>
</div>

</template>

<script>

import { ref, reactive, computed } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'
import AlbumHeading from '@/components/AlbumHeading.vue'

export default {
  components: {
    AlbumHeading
  },

  setup() {
    const route = useRoute()

    const album = ref(null)

    const frameHeading = reactive(computed(() => ({
      title: album.value.title,
      artist: album.value.artist,
      releaseYear: album.value.releaseYear.title,
      period: album.value.releaseYear._id,
      genre: album.value.genre
    })))

    const saveFrameDescription = (value) => {
      console.log(value)
    }

    const fetchFrame = async () => {
      try {
        const response = await axios.get(`/api/frames/${route.params.id}`)
        album.value = response.data
      } catch (error) {
        console.error(error.response)
      }
    }

    fetchFrame()

    return {
      album,
      frameHeading,
      saveFrameDescription
    }
  }
}

</script>

<style lang="scss" scoped>

.album__heading {
  flex: 1 1 0;
  padding-left: 25px;
}

</style>
