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

import { defineComponent } from 'vue'
import 'vue3-carousel/dist/carousel.css'
// @ts-ignore
import { Carousel, Slide, Navigation } from 'vue3-carousel'

export default defineComponent({
  components: {
    Carousel,
    Slide,
    Navigation
  },

  props: {
    data: {
      type: Array as () => string[],
      required: true
    }
  }
})

</script>
