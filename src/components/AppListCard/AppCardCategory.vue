<template>
  
<router-link
  class="category__link"
  :to="`/${categorySlug}/${category.id}`"
  :disabled="category.preloader"
>
  <img
    v-if="category.image"
    :src="category.image"
    :alt="category.title"
    class="category__cover"
  >

  <div
    v-else
    class="category__cover_skeleton"
  ></div>

  <div
    v-if="category.title"
    class="category__title"
  >{{ category.title }}</div>

  <div
    v-else
    class="category__title_skeleton"
  ></div>

  <div
    v-if="category.albumsLength && !isNaN(category.albumsLength)"
    class="category__info"
  >
    Albums: {{ category.albumsLength }}
  </div>

  <div
    v-else
    class="category__info_skeleton"
  ></div>
</router-link>

</template>

<script>

export default {
  props: {
    category: {
      type: Object,
      required: true
    },

    categorySlug: {
      type: String,
      required: true
    }
  }
}

</script>

<style lang="scss" scoped>

@import '@/scss/variables';

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

    &_skeleton {
      width: 170px;
      height: 170px;
      margin-bottom: 7px;
      border-radius: 50%;
      position: relative;
      background-color: $skeleton;

      &:after {
        content: '';
        @include skeleton;
      }
    }
  }

  &__title {
    font-weight: 600;
    color: $dark;
    font-size: 14px;

    &_skeleton {
      height: 15px;
      background-color: $skeleton;
      width: 75%;
      margin: 0 auto 3px;
      position: relative;

      &:after {
        content: '';
        @include skeleton;
      }
    }
  }

  &__info {
    font-weight: 600;
    color: $pale;
    font-size: 12px;

    &_skeleton {
      height: 15px;
      background-color: $skeleton;
      width: 90%;
      margin: 0 auto;
      position: relative;

      &:after {
        content: '';
        @include skeleton;
      }
    }
  }
}

</style>
