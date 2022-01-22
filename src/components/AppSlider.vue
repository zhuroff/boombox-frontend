<template>
  
<div class="slider">
  <Carousel
    :itemsToShow="1"
    :wrapAround="true"
  >
    <Slide
      v-for="src in data.data"
      :key="src"
    >
      <div class="carousel__item">
        <img class="carousel__image" :src="src">
      </div>
    </Slide>

    <template #addons>
      <Navigation />
    </template>
  </Carousel>
</div>

</template>

<script>

import 'vue3-carousel/dist/carousel.css'
import { Carousel, Slide, Navigation } from 'vue3-carousel'

export default {
  components: {
    Carousel,
    Slide,
    Navigation
  },

  props: {
    data: {
      type: Object,
      required: true
    }
  }
}

</script>
