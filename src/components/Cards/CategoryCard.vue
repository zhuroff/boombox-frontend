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

<script setup lang="ts">
import { hostString } from '~/utils'
import CategoryItem from '~/classes/CategoryItem'

interface Props {
  card: CategoryItem
  placeholderImage: string
  rootPath: string
}

defineProps<Props>()

const host = (pathname: string) => hostString(pathname)
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
    @include cardHeading();
  }

  &__info {
    @include cardCaption();
  }
}
</style>
