<template>
  
<div class="album__booklet">
  <img
    :src="albumCover || '/img/album.webp'"
    class="album__cover"
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
import { defineComponent, PropType, ref, Ref } from 'vue'
import { BookletStateDTO } from '~/dto/BookletStateDTO'
import Sprite from '~/components/Sprite/Sprite.vue'

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
    booklet: {
      type: Object as PropType<BookletStateDTO>,
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

<style lang="scss">
@import '../scss/variables.scss';
@import 'include-media';

.album {

  &__booklet {
    flex: none;
    z-index: 10;

    @include media('>=laptop') {
      width: 300px;
    }

    &:hover {

      .album__cover_upload {
        opacity: 1;
        transition: opacity 0.3s ease;
      }
    }

    & + .button {

      @include media('<laptop') {
        width: auto;
        position: absolute;
        right: 25px;
        bottom: 25px;
      }
    }
  }

  &__cover {
    display: block;
    width: inherit;
    object-fit: cover;
    // margin-bottom: 10px;
    cursor: pointer;

    @include media('<laptop') {
      width: 100%;
      height: auto;
    }

    @include media('>=laptop') {
      height: 300px;
      border-radius: 3px;
    }

    &_upload {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      cursor: pointer;
      opacity: 0;
      border-radius: 3px;
      overflow: hidden;
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
