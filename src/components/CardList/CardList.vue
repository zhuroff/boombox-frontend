<template>
  <ul class="cardlist">
    <slot></slot>
  </ul>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'CardList'
})
</script>

<style lang="scss" scoped>
@import '~/scss/variables';
@import 'include-media';

.cardlist {
  display: grid;
  overflow: hidden;

  &:not(.--yt) {
    @include media('<tablet') {
      grid-template-columns: repeat(2, calc(50% - 5px));
      gap: 10px;

      @include media('landscape') {
        grid-template-columns: repeat(3, calc(33.3333% - 5px));
      }
    }

    @include media('>=tablet') {
      grid-template-columns: repeat(3, calc(33.3333% - 5px));
      gap: 10px;
    }

    @include media('>=laptop') {
      justify-content: flex-start;
    }

    @include media('>=desktop') {
      grid-template-columns: repeat(4, 252px);
      gap: 0;
    }

    @include media('>=desktop-md') {
      grid-template-columns: repeat(5, 252px);
    }

    @include media('>=desktop-lg') {
      grid-template-columns: repeat(6, 252px);
    }

    @include media('>=desktop-hg') {
      grid-template-columns: repeat(7, 252px);
    }
  }

  &.--yt {
    @include media('<tablet') {
      grid-template-columns: 1fr;
      gap: 10px;

      @include media('landscape') {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    @include media('>=tablet') {
      grid-template-columns: repeat(2, 2fr);
      gap: 20px;
    }
  }

  @include media('<desktop') {
    padding: 25px;
  }

  @include media('>=desktop') {
    padding: 25px 10px;
  }
}
</style>
