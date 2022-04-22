<template>
  
<div class="slider">
  <Carousel
    :itemsToShow="1"
    :wrapAround="true"
  >
    <Slide
      v-for="item in data"
      :key="item"
    >
      <div class="carousel__item">
        <img class="carousel__image" :src="item">
      </div>
    </Slide>

    <template #addons>
      <Navigation />
    </template>
  </Carousel>
</div>

</template>

<script lang="ts">

import { defineComponent, PropType } from 'vue'
// @ts-ignore
import { Carousel, Slide, Navigation } from 'vue3-carousel'
import 'vue3-carousel/dist/carousel.css'

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
    }
  }
})

</script>
