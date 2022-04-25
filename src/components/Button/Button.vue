<template>
  <button
    :class="[{ '--fullwidth' : isFullWidth }, { '--filled' : isFilled }, 'button']"
    :type="type"
    :disabled="isDisabled"
    @click="emitButtonClick"
  >
    <span class="button__text">{{ text }}</span>
  </button>
</template>

<script lang="ts">

import { defineComponent } from 'vue'
import './Button.scss'

export default defineComponent({
  name: 'Button',

  props: {
    text: {
      type: String,
      required: true
    },

    type: {
      type: String,
      required: false,
      default: 'button'
    },

    isFilled: {
      type: Boolean,
      required: false,
      default: false
    },

    isFullWidth: {
      type: Boolean,
      required: false,
      default: false
    },

    isDisabled: {
      type: Boolean,
      required: false,
      default: false
    }
  },

  setup(_, { emit }) {
    const emitButtonClick = () => emit('onClick')

    return { emitButtonClick }
  }
})

</script>
