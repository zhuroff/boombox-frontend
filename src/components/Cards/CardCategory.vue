<template>
  
<router-link
  class="category__link"
  :to="`/${categorySlug}/${category._id}`"
  :disabled="category.preloader"
>
  <img
    :src="category.avatar ? host(category.avatar) : placeholder"
    :alt="category.title"
    class="category__cover"
  >

  <div class="category__title">{{ category.title }}</div>

  <div class="category__info">Albums: {{ category.albums }}</div>
</router-link>

</template>

<script lang="ts">

import { defineComponent, PropType } from 'vue'
import { CategoryItem } from '~/types/Category'
import { hostString } from '~/shared/media'

export default defineComponent({
  name: 'CardCategory',

  props: {
    category: {
      type: Object as PropType<CategoryItem>,
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
  },

  setup() {
    const host = (pathname: string) => hostString(pathname)

    return { host }
  }
})

</script>

<style lang="scss" scoped>

@import '~/scss/variables';
@import 'include-media';

.category {

  &__link {
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;

    @include media('>=laptop') {
      padding: 0 10px;
    }
  }

  &__cover {
    display: block;
    margin-bottom: 7px;
    background-color: $white;
    border-radius: 50%;
    object-fit: cover;
    position: relative;
    z-index: 10;

    @include media('<laptop') {
      width: 42vw;
      height: 42vw;

      @include media('landscape') {
        width: 30.085vw;
        height: 30.085vw;
      }
    }

    @include media('>=laptop') {
      width: 170px;
      height: 170px;
    }
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
