<template>
  <li class="cards__category">
    <router-link
      class="card-category__link"
      :to="`/${rootPath}/${card._id}`"
    >
      <img
        :src="card.avatar ? host(card.avatar) : placeholderImage"
        :alt="card.title"
        class="card-category__cover"
      >
      <div class="card-category__title">{{ card.title }}</div>
      <div class="card-category__info">Albums: {{ card.albums }}</div>
    </router-link>
  </li>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { hostString } from '~/utils'
import CategoryItem from '~/classes/CategoryItem'

export default defineComponent({
  name: 'CategoryCard',
  props: {
    card: {
      type: Object as PropType<CategoryItem>,
      required: true
    },
    placeholderImage: {
      type: String,
      required: true
    },
    rootPath: {
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

.card-category {

  &__link {
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 1rem;

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
    color: $paleDP;
    font-size: 12px;
  }
}
</style>
