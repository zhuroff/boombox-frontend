<template>
  
<router-link
  class="category__link"
  :to="`/${categorySlug}/${category._id}`"
  :disabled="category.preloader"
>
  <img
    :src="category.avatar || placeholder"
    :alt="category.title"
    class="category__cover"
  >

  <div class="category__title">{{ category.title }}</div>

  <div class="category__info">Albums: {{ category.albums }}</div>
</router-link>

</template>

<script lang="ts">

import { defineComponent } from 'vue'
import { ICategoryMedium } from '~/types/Category'

export default defineComponent({
  props: {
    category: {
      type: Object as () => ICategoryMedium,
      required: true
    },

    placeholder: {
      type: String,
      required: true
    },

    categorySlug: {
      type: String,
      required: true
    }
  }
})

</script>

<style lang="scss" scoped>

@import '~/scss/variables';

.category {

  &__link {
    padding: 0 10px;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  &__cover {
    width: 170px;
    display: block;
    height: 170px;
    margin-bottom: 7px;
    background-color: $white;
    border-radius: 50%;
    object-fit: cover;
    position: relative;
    z-index: 10;
  }

  &__title {
    font-weight: 600;
    color: $dark;
    font-size: 14px;
  }

  &__info {
    font-weight: 600;
    color: $pale;
    font-size: 12px;
  }
}

</style>
