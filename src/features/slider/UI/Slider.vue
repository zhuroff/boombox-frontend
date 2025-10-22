<template>  
  <div class="slider">
    <Carousel
      ref="slider"
      :itemsToShow="1"
      :wrapAround="true"
      @slide-start="handleSlideStart"
    >
      <Slide
        v-for="item in data"
        :key="item"
      >
        <div class="carousel__item">
          <img class="carousel__image" :src="item">
        </div>
      </Slide>
      <template #addons="{ currentSlide }">
        <Navigation :class="{
          '--full' : isFullSlideSet,
          '--first' : currentSlide === 0
        }" />
      </template>
    </Carousel>
  </div>
</template>

<script setup lang="ts">
import { Carousel, Slide, Navigation } from 'vue3-carousel'

interface BookletSlideState {
  currentSlideIndex: number
  prevSlideIndex: number
  slidesCount: number
  slidingToIndex: number
}

interface Props {
  data: string[]
  isFullSlideSet: boolean
}

interface Emits {
  (e: 'slideChanged', data: BookletSlideState): void
}

defineProps<Props>()
const emit = defineEmits<Emits>()

const handleSlideStart = (data: BookletSlideState) => {
  emit('slideChanged', data)
}
</script>

<style lang="scss">
@use '~/app/styles/variables' as var;
@import 'vue3-carousel/dist/carousel.css';

.slider {
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;

  .carousel {
    height: 100%;
  
    &__viewport,
    &__track,
    &__slide {
      height: inherit;
    }
  
    &__slide {
      padding: 25px;
    }
  
    &__image {
      display: block;
      max-height: calc(100vh - 50px);
      max-width: calc(100vw - 50px);
    }
  
    &__prev {
      background-color: transparent;
      color: var.$paleDP;
      transition: color 0.2s var.$animation;

      &:hover {
        color: var.$white;
        transition: color 0.2s var.$animation;
      }

      &:not(.--full) {
        pointer-events: none;
        opacity: 0.5;

        &:not(.--first) {
          pointer-events: all;
          opacity: 1;
        }
      }

      @include var.media('<desktop') {
        transform: translate(0, -50%);
        width: 50px;
        height: 50px;
      }

      @include var.media('>=desktop') {
        transform: translate(25px, -50%);
        width: 75px;
        height: 75px;
      }
    }
  
    &__next {
      background-color: transparent;
      color: var.$paleDP;
      transition: color 0.2s var.$animation;

      &:hover {
        color: var.$white;
        transition: color 0.2s var.$animation;
      }

      @include var.media('<desktop') {
        transform: translate(0, -50%);
        width: 50px;
        height: 50px;
      }

      @include var.media('>=desktop') {
        transform: translate(-25px, -50%);
        width: 75px;
        height: 75px;
      }
    }

    &__icon {
      width: inherit;
      height: inherit;
    }
  }
}
</style>
