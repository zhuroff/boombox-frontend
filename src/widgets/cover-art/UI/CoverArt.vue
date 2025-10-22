<template>  
  <div class="cover">
    <img
      :src="cover || '/img/album.webp'"
      class="cover__image"
      referrerpolicy="no-referrer"
      @click="toggleBookletModal"
    >
    <transition name="fade">
      <Modal
        :isModalActive="isActive"
        @closeModal="closeBookletModal"
      >
        <Loader
          v-if="isFetching"
          mode="dark"
        />
        <div
          v-else-if="!booklet.items.length"
          class="cover__booklet-empty"
        >
          <p>{{ localize('noBooklet') }}</p>
        </div>
        <Slider
          v-else
          :data="booklet.items"
          :isFullSlideSet="isFullSlideSet"
          @slideChanged="slideChanged"
        />
      </Modal>
    </transition>
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
import { ref, computed, type Ref } from 'vue'
import { Modal, Loader, Sprite } from '~shared/UI'
import { Slider } from '~features/slider'
import { useCoverArt } from '~widgets/cover-art'
import { DatabaseService } from '~shared/api'
import { useDevice, useLocalization } from '~shared/model'
import type { ExcludeFromUnifiedEntityCard } from '~widgets/entity-cards'

interface BookletSlideState {
  currentSlideIndex: number
  prevSlideIndex: number
  slidesCount: number
  slidingToIndex: number
}

interface Props {
  entityKey: string
  cover?: string
  uploadable?: boolean
  uploadSlug?: string
  entity?: ExcludeFromUnifiedEntityCard<'CategoryBasic'>
}

interface Emits {
  (e: 'uploadImage', image: File): void
}

const dbService = new DatabaseService()

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const { isMobile } = useDevice()
const { localize } = useLocalization()

const coverElement: Ref<null | HTMLInputElement> = ref(null)
const isFullSlideSet = ref(false)

const entity = computed(() => props.entity)

const { booklet, isActive, isFetching, loadMoreImages, resetBooklet } = useCoverArt(props.entityKey, entity, dbService)

const closeBookletModal = () => {
  isActive.value = false
  resetBooklet()
}

const toggleBookletModal = () => {
  if (props.uploadable || isMobile.value) return
  isActive.value = true
}

const setCover = () => {
  if (coverElement?.value?.files) {
    emit('uploadImage', coverElement.value.files[0])
  }
}

const slideChanged = (payload: BookletSlideState) => {
  loadMoreImages(payload.slidingToIndex)
}
</script>

<style lang="scss">
@use '~/app/styles/variables' as var;

.cover {
  z-index: 10;
  position: relative;

  @include var.media('<desktop') {
    position: fixed;
    top: calc(110px + 1rem);
    left: 1rem;
    width: calc(100vw - 2rem);
    height: calc(100vw - 2rem);
    border-radius: var.$borderRadiusMD;
    overflow: hidden;
  }

  @include var.media('>=desktop') {
    width: var.$coverWidth;
  }

  &:hover {

    .album__cover_upload {
      opacity: 1;
      transition: opacity 0.3s ease;
    }
  }

  & + .button {

    @include var.media('<desktop') {
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

    @include var.media('<desktop') {
      width: 100%;
      height: auto;
      max-height: 100vh;
    }

    @include var.media('>=desktop') {
      height: var.$coverWidth;
      border-radius: var.$borderRadiusSM;
    }
  }

  &__booklet-empty {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    color: var.$warning;
    @include var.serif(3rem);
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

    &:hover {
      opacity: 1;
    }
  }
}
</style>
