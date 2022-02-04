<template>
  
<a
  :href="item.site_url"
  target="_blank"
  class="news__link"
>
  <img
    :src="item.images[0].image"
    :alt="item.title"
    class="news__thumbnail"
  />

  <time class="news__dates">{{ readableDate }}</time>
  <div class="news__title">{{ item.title }}</div>
  <div class="news__description">{{ item.description }}</div>
  <div
    v-if="item.price || item.is_free"
    class="news__price"
  >
    <span v-if="item.is_free" class="--free">Бесплатно</span>
    <span v-else-if="item.price" class="--paid">{{ item.price }}</span>
  </div>
</a>

</template>

<script>

import { computed } from 'vue'
import { formatDates } from '@/helpers/formatters'

export default {
  props: {
    item: {
      type: Object,
      required: true
    }
  },

  setup(props) {
    const readableDate = computed(() => formatDates(props.item.dates))

    return {
      readableDate
    }
  }
}

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
