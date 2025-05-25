<template>  
  <div class="cover">
    <img
      :src="cover || '/img/album.webp'"
      class="cover__image"
      referrerpolicy="no-referrer"
      @click="toggleBookletModal"
    >
    <!-- <transition name="fade">
      <Modal
        v-if="booklet?.isActive"
        :isModalActive="booklet?.isActive"
        @closeModal="closeBookletModal"
      >
        <Loader
          v-if="!booklet.isFetched"
          mode="dark"
        />
        <Slider
          v-else
          :data="booklet.items.map(({ url }) => url)"
          :isFullSlideSet="isFullSlideSet"
          @slideChanged="slideChanged"
        />
      </Modal>
    </transition> -->
    <form
      v-if="uploadable"
      class="cover__upload"
    >
      <label class="cover__upload-label">
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

<script setup lang="ts">
import { ref, watch, type Ref } from 'vue'
import type { BookletSlideState } from '~/types/Album'
import { Modal, Loader, Sprite } from '~shared/UI'
import Slider from '~/components/Slider.vue'
import { useCoverArt } from '~widgets/cover-art'
import { DatabaseService } from '~shared/api'

interface Props {
  cover?: string
  // booklet?: BookletState
  uploadable?: boolean
  uploadSlug?: string
  entity?: Entity & { path: string }
}

interface Emits {
  (e: 'coverClick'): void
  (e: 'closeBookletModal'): void
  (e: 'uploadImage', image: File): void
  (e: 'slideChanged', data: BookletSlideState): void
}

const dbService = new DatabaseService()

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const coverElement: Ref<null | HTMLInputElement> = ref(null)
const isFullSlideSet = ref(false)

const { data: booklet, isActive } = useCoverArt(dbService, props.entity)

const closeBookletModal = () => {
  emit('closeBookletModal')
}

const toggleBookletModal = () => {
  isActive.value = true
}

const setCover = () => {
  if (coverElement?.value?.files) {
    emit('uploadImage', coverElement.value.files[0])
  }
}

const slideChanged = (data: BookletSlideState) => {
  emit('slideChanged', data)
}

// watch(
//   () => props.booklet,
//   (val) => {
//     if (val?.isCompleted) {
//       isFullSlideSet.value = true
//     }
//   }
// )
</script>

<style lang="scss">
@use '~/scss/variables' as var;

.cover {
  z-index: 10;
  position: relative;

  @include var.media('>=laptop') {
    width: var.$coverWidth;
  }

  &:hover {

    .album__cover_upload {
      opacity: 1;
      transition: opacity 0.3s ease;
    }
  }

  & + .button {

    @include var.media('<laptop') {
      width: auto;
      position: absolute;
      right: 25px;
      bottom: 25px;
    }
  }

  &__image {
    display: block;
    width: inherit;
    object-fit: cover;
    cursor: pointer;

    @include var.media('<laptop') {
      width: 100%;
      height: auto;
    }

    @include var.media('>=laptop') {
      height: var.$coverWidth;
      border-radius: var.$borderRadiusSM;
    }
  }

  &__upload {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    cursor: pointer;
    opacity: 0;
    border-radius: var.$borderRadiusSM;
    overflow: hidden;
    transition: opacity 0.3s ease;
    background-color: rgba(0, 0, 0, 0.75);

    &-label {
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

      .icon {
        color: var.$white;
      }
    }
  }
}
</style>
