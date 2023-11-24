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

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { Carousel, Slide, Navigation } from 'vue3-carousel'
import { BookletSlideState } from '~/types/Album'

export default defineComponent({
  components: {
    Carousel,
    Slide,
    Navigation
  },
  props: {
    data: {
      type: Array as PropType<string[]>,
      required: true
    },
    isFullSlideSet: {
      type: Boolean,
      required: true
    }
  },
  setup(_, { emit }) {
    const handleSlideStart = (data: BookletSlideState) => {
      emit('slideChanged', data)
    }

    return {
      handleSlideStart
    }
  }
})

</script>

<style lang="scss">
@import '../scss/variables.scss';
@import 'include-media';
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
      color: $pale;
      transition: color 0.2s $animation;

      &:hover {
        color: $white;
        transition: color 0.2s $animation;
      }

      &:not(.--full) {
        pointer-events: none;
        opacity: 0.5;

        &:not(.--first) {
          pointer-events: all;
          opacity: 1;
        }
      }

      @include media('<laptop') {
        transform: translate(0, -50%);
        width: 50px;
        height: 50px;
      }

      @include media('>=laptop') {
        transform: translate(25px, -50%);
        width: 75px;
        height: 75px;
      }
    }
  
    &__next {
      background-color: transparent;
      color: $pale;
      transition: color 0.2s $animation;

      &:hover {
        color: $white;
        transition: color 0.2s $animation;
      }

      @include media('<laptop') {
        transform: translate(0, -50%);
        width: 50px;
        height: 50px;
      }

      @include media('>=laptop') {
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
