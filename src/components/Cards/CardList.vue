<template>
  <VueDraggableNext
    handle=".--drag"
    tag="ul"
    class="cardlist"
    :animation="300"
    :disabled="isDisabled"
    @end="(event) => $emit('orderChanged', event)"
  >
    <slot></slot>
  </VueDraggableNext>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { VueDraggableNext } from 'vue-draggable-next'

export default defineComponent({
  name: 'CardList',
  components: {
    VueDraggableNext
  },
  props: {
    isDisabled: {
      type: Boolean,
      required: false,
      default: false
    }
  }
})
</script>

<style lang="scss" scoped>
@import '~/scss/variables';
@import 'include-media';
.cardlist {
  display: grid;
  overflow: hidden;

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
    padding: 25px 10px;
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

  @include media('<desktop') {
    padding: 25px;
  }
}
</style>
