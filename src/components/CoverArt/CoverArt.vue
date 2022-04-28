<template>
  
<div class="album__booklet">
  <img
    :src="albumCover || '/img/album.webp'"
    :class="[{ '--booklet' : isBooklet }, 'album__cover']"
    @click="$emit('coverClick')"
  >

  <form
    v-if="uploadable"
    class="album__cover_upload"
  >
    <label class="album__cover_label">
      <input
        type="file"
        ref="coverElement"
        @change="setCover"
      >
      <Sprite name="camera" />
    </label>
  </form>
</div>

</template>

<script lang="ts">

import { defineComponent, ref, Ref } from 'vue'
import Sprite from '~/components/Sprite/Sprite.vue'
import './CoverArt.scss'

export default defineComponent({
  name: 'CoverArt',

  components: {
    Sprite
  },

  props: {
    albumCover: {
      type: String,
      required: false
    },

    isBooklet: {
      type: Boolean,
      required: false
    },

    uploadable: {
      type: Boolean,
      required: false,
      default: false
    },

    uploadSlug: {
      type: String,
      required: false
    }
  },

  setup(_, { emit }) {
    const coverElement: Ref<null | HTMLInputElement> = ref(null)

    const setCover = () => {
      if (coverElement?.value?.files) {
        emit('uploadImage', coverElement.value.files[0])
      }
    }

    return {
      coverElement,
      setCover
    }
  }
})

</script>
