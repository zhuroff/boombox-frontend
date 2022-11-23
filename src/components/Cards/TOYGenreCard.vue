<template>
  <li class="toylist__item" :style="getBackground()">
    <router-link class="toylist__genre" :to="{ path: `/toy/${content.route}` }">{{ content.name }}</router-link>
  </li>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'

export default defineComponent({
  name: 'TOYGenreCard',
  props: {
    content: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    const getBackground = () => {
      if (props.content.file) {
        return {
          'background-image': `url(${props.content.file})`
        }
      }
      return {}
    }

    return { getBackground }
  }
})
</script>

<style lang="scss">
@import '~/scss/variables';

.toylist {

  &__item {
    border-radius: 5px;
    transition: box-shadow 0.5s $animation;
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;
    position: relative;
    overflow: hidden;

    &:before {
      content: '';
      background-color: $dark;
      opacity: 0.7;
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 1;
      transition: opacity 0.3s $animation;
    }

    &:hover {
      box-shadow: rgb(0 0 0 / 35%) 0px 5px 15px;
    }

    &.--light {
      border: 1px solid $pale;

      &:before {
        content: none;
      }

      &:hover {
        background-color: $warning;
        border-color: $warning;
        transition: all 0.3s $animation;
      }
    }
  }

  &__genre {
    padding: 25px;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    position: relative;
    z-index: 2;
    color: $white;
    font-size: 1.25rem;
    font-weight: 600;
    text-align: center;

    &.router-link-active {
      background-color: $accent;
    }
  }

  &.--small {

    .toylist__item {
      background-image: none !important;
      box-shadow: none;

      &:before {
        opacity: 1;
        transition: opacity 0.3s $animation;
      }
    }

    .toylist__genre {
      padding: 10px;
      font-size: 0.875rem;
    }
  }
}
</style>
