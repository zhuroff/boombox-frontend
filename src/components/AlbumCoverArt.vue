<template>
  
<div class="album__booklet">
  <img
    :src="albumCover || 'https://s.mxmcdn.net/site/images/album-placeholder.png'"
    :class="[{ '--booklet' : albumCoverArt > 0 }, 'album__cover']"
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
      <AppSprite name="camera" />
    </label>
  </form>
</div>

</template>

<script lang="ts">

import { defineComponent, ref, Ref } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'
import AppSprite from '~/components/AppSprite.vue'

export default defineComponent({
  components: {
    AppSprite
  },

  props: {
    albumCover: {
      type: String,
      required: false
    },

    albumCoverArt: {
      type: Number,
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

  setup(props, { emit }) {
    const route = useRoute()

    const coverElement: Ref<null | HTMLInputElement> = ref(null)

    const uploadImage = async (file: File, fieldname: string) => {
      const formData = new FormData()
      const url = `/api/${props.uploadSlug}/${route.params.id}/${fieldname}`

      formData.append(fieldname, file)

      try {
        const response = await axios.post(url, formData)
        emit('updateCover', response.data)
      } catch (error) {
        console.error(error)
      }
    }

    const setCover = () => {
      if (coverElement?.value?.files) {
        uploadImage(coverElement.value.files[0], 'cover')
      }
    }

    return {
      coverElement,
      setCover
    }
  }
})

</script>

<style lang="scss" scoped>

@import '~/scss/variables';

.album {

  &__booklet {
    width: 230px;
    flex: none;
    position: sticky;
    top: 25px;
    z-index: 10;

    &:hover {

      .album__cover_upload {
        opacity: 1;
        transition: opacity 0.3s ease;
      }
    }
  }

  &__cover {
    display: block;
    width: inherit;
    height: 230px;
    object-fit: cover;
    border-radius: 3px;

    &.--booklet {
      cursor: pointer;
    }

    &.--placeholder {
      background: repeating-linear-gradient(-45deg, transparent, transparent 15px, $border 15px, $border 30px);
      background-size: 150% 150%;
      animation: placeholder 5s linear infinite;
    }

    &_upload {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      cursor: pointer;
      opacity: 0;
      transition: opacity 0.3s ease;

      &:before {
        content: '';
        background-color: rgba(0, 0, 0, 0.75);
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
      }
    }

    &_label {
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;

      input {
        position: absolute;
        width: 0;
        height: 0;
        opacity: 0;
        outline: none;
      }
    }
  }
}

</style>
