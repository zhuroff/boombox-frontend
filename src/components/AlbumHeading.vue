<template>
  
<div
  v-if="heading.title"
  class="album__heading"
>
  <h1 class="album__title">{{ heading.title }}</h1>

  <div
    class="album__info"
    v-if="heading.artist"
  >
    <router-link
      :to="`/artists/${heading.artist._id}`"
      class="album__info-link"
    >
      {{ heading.artist.title }}
    </router-link>,

    <router-link
      :to="`/periods/${heading.period}`"
      class="album__info-link"
    >
      {{ heading.releaseYear }}
    </router-link> /

    <router-link
      :to="`/genres/${heading.genre._id}`"
      class="album__info-link"
    >
      {{ heading.genre.title }}
    </router-link>

    <AppTextarea
      :initHeight="44"
      :content="albumDescription"
      classname="album__description"
      placeholder="Type some description..."
      @typeText="textInputHandler"
    />
  </div>
</div>

<div
  v-else
  class="album__heading --placeholder"
></div>

</template>

<script>

import { computed } from 'vue'
import AppTextarea from '@/components/AppTextarea.vue'

export default {
  components: {
    AppTextarea
  },

  props: {
    heading: {
      type: Object,
      required: true
    }
  },

  setup(props, { emit }) {
    const albumDescription = computed(() => (
      props.heading.description
    ))

    const textInputHandler = (value) => emit('textInputHandler', value)

    return {
      albumDescription,
      textInputHandler
    }
  }
}

</script>

<style lang="scss" scoped>

@import '@/scss/variables';

.album {

  &__heading {

    &.--placeholder {
      height: 131px;
      background: repeating-linear-gradient(-45deg, transparent, transparent 15px, $border 15px, $border 30px);
      background-size: 150% 150%;
      animation: placeholder 5s linear infinite;
    }
  }

  &__title {
    font-weight: 700;
    font-size: 50px;
    color: $dark;
  }

  &__info {
    font-size: 18px;
    font-weight: 600;
    color: $pale;
    margin-bottom: 10px;

    &-link {
      color: inherit;
      transition: color 0.2s ease;

      &:hover {
        color: $dark;
        transition: color 0.2s ease;
      }
    }
  }

  &__description {
    border: 0;
    border-bottom: 1px solid transparent;
    width: 100%;
    display: block;
    margin-top: 10px;
    background-color: transparent;
    outline: none;
    transition: border-color 0.2s ease;
    font-size: 14px;
    color: $pale;
    line-height: 20px;

    &:focus,
    &:active {
      border-color: $pale;
      transition: border-color 0.2s ease;
    }
  }
}

</style>
