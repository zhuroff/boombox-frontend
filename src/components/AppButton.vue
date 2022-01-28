<template>
  <button
    :class="[{ '--fullwidth' : isFullWidth }, 'button']"
    @click="emitButtonClick"
  >
    <span class="button__text">{{ text }}</span>
  </button>
</template>

<script lang="ts">

import { defineComponent } from 'vue'

export default defineComponent({
  props: {
    text: {
      type: String,
      required: true
    },

    isFullWidth: {
      type: Boolean,
      required: false,
      default: false
    }
  },

  setup(props, { emit }) {
    const emitButtonClick = () => emit('onClick')

    return { emitButtonClick }
  }
})

</script>

<style lang="scss" scoped>

@import '~/scss/variables';

.button {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 40px;
  flex: none;
  background-color: transparent;
  border: 1px solid $dark;
  border-radius: 3px;
  padding: 0 20px;
  transition: background-color 0.5s $animation;

  &__text {
    font-size: 14px;
    color: $dark;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.3px;
    transition: color 0.5s $animation;
  }

  &.--fullwidth {
    width: 100%;
  }

  &:hover {
    background-color: $dark;
    transition: background-color 0.5s $animation;

    .button__text {
      color: $white;
      transition: color 0.5s $animation;
    }
  }
}

</style>
