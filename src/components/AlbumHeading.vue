<template>
  
<div
  class="album__heading"
>
  <h1 class="album__title">{{ albumHead.title }}</h1>

  <div
    class="album__info"
    v-if="albumHead.artist"
  >
    <router-link
      :to="`/artists/${albumHead.artist._id}`"
      class="album__info-link"
    >
      {{ albumHead.artist.title }}
    </router-link>,

    <router-link
      :to="`/periods/${albumHead.period._id}`"
      class="album__info-link"
    >
      {{ albumHead.period.title }}
    </router-link> /

    <router-link
      :to="`/genres/${albumHead.genre._id}`"
      class="album__info-link"
    >
      {{ albumHead.genre.title }}
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

</template>

<script lang="ts">

import { defineComponent, ComputedRef, computed } from 'vue'
import { AlbumHeadProps } from '~/types/Album'
import AppTextarea from '~/components/AppTextarea.vue'

export default defineComponent({
  components: {
    AppTextarea
  },

  props: {
    albumHead: {
      type: Object as () => AlbumHeadProps,
      required: true
    }
  },

  setup(props, { emit }) {
    const albumDescription: ComputedRef<string> = computed(() => (
      props.albumHead.description
    ))

    const textInputHandler = (value: string) => (
      emit('textInputHandler', value)
    )

    return {
      albumDescription,
      textInputHandler
    }
  }
})

</script>

<style lang="scss" scoped>

@import '~/scss/variables';

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
