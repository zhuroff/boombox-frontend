<template>
  
<a
  :href="item.siteUrl"
  target="_blank"
  class="news__link"
>
  <img
    :src="item.imageUrl"
    :alt="item.title"
    class="news__thumbnail"
  />

  <time class="news__dates">{{ item.dates }}</time>
  <div class="news__title">{{ item.title }}</div>
  <div class="news__description">{{ item.description }}</div>
  <div
    v-if="item.price || item.isFree"
    class="news__price"
  >
    <span v-if="item.isFree" class="--free">Бесплатно</span>
    <span v-else-if="item.price" class="--paid">{{ item.price }}</span>
  </div>
</a>

</template>

<script lang="ts">

import { defineComponent } from 'vue'
import { NewsPage } from '~/types/News'

export default defineComponent({
  props: {
    item: {
      type: Object as () => NewsPage,
      required: true
    }
  }
})

</script>

<style lang="scss" scoped>

@import '@/scss/variables';

.news {

  &__link {
    display: block;
    grid-column: 1;
  }

  &__thumbnail {
    display: block;
    width: 100%;
    height: 140px;
    object-fit: cover;
    border-radius: 5px;
    margin-bottom: 5px;
    font-size: 12px;
    color: $pale;
  }

  &__dates {
    font-size: 12px;
    color: $pale;
  }

  &__title {
    font-weight: 600;
    margin-bottom: 5px;
    color: $dark;

    &::first-letter {
      text-transform: uppercase;
    }
  }

  &__description {
    font-size: 12px;
    color: $pale;
    margin-bottom: 10px;
  }

  &__price {
    font-size: 12px;
    font-weight: 600;

    .--free {
      color: $success;
    }

    .--paid {
      color: $info;
    }
  }
}

</style>
