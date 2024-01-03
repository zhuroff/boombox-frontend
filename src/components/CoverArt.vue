<template>  
  <div class="album__booklet">
    <img
      :src="cover || '/img/album.webp'"
      class="album__cover"
      @click="$emit('coverClick')"
    >
    <transition name="fade">
      <Modal
        v-if="booklet?.isActive"
        :isModalActive="booklet?.isActive"
        @closeModal="closeBookletModal"
      >
        <Preloader v-if="!booklet.isFetched" mode="dark" />
        <Slider
          v-else
          :data="booklet.items.map(({ url }) => url)"
          :isFullSlideSet="isFullSlideSet"
          @slideChanged="slideChanged"
        />
      </Modal>
      </transition>
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
import { defineComponent, PropType, ref, Ref, watch } from 'vue'
import { BookletSlideState } from '~/types/Album'
import BookletState from '~/classes/BookletState'
import Sprite from '~/components/Sprite/Sprite.vue'
import Modal from '~/components/Modal.vue'
import Preloader from '~/components/Preloader.vue'
import Slider from '~/components/Slider.vue'

export default defineComponent({
  name: 'CoverArt',
  components: {
    Sprite,
    Modal,
    Preloader,
    Slider
  },
  props: {
    cover: {
      type: String,
      required: false
    },
    booklet: {
      type: Object as PropType<BookletState>,
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
  setup({ booklet }, { emit }) {
    const coverElement: Ref<null | HTMLInputElement> = ref(null)
    const isFullSlideSet = ref(false)

    const closeBookletModal = () => {
      emit('closeBookletModal')
    }

    const setCover = () => {
      if (coverElement?.value?.files) {
        emit('uploadImage', coverElement.value.files[0])
      }
    }

    const slideChanged = (data: BookletSlideState) => {
      emit('slideChanged', data)
    }

    watch(
      [booklet],
      ([val]) => {
        if (val?.isCompleted) {
          isFullSlideSet.value = true
        }
      }
    )

    return {
      closeBookletModal,
      isFullSlideSet,
      slideChanged,
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
      width: 350px;
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
    cursor: pointer;

    @include media('<laptop') {
      width: 100%;
      height: auto;
    }

    @include media('>=laptop') {
      height: 350px;
      border-radius: $borderRadiusSM;
    }

    &_upload {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      cursor: pointer;
      opacity: 0;
      border-radius: $borderRadiusSM;
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
