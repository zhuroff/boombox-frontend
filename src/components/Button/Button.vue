<template>
  <button
    :id="id || undefined"
    :class="[{ '--fullwidth' : isFullWidth }, { '--filled' : isFilled }, `--${mode} button`]"
    :type="type"
    :disabled="isDisabled || isLoading"
    @click="emitButtonClick"
  >
    <span class="button__text">{{ text }}</span>
    <Preloader
      mode="dark"
      v-if="isLoading"
    />
  </button>
</template>

<script lang="ts">

import { defineComponent } from 'vue'
import Preloader from '~/components/Preloader.vue'
import './Button.scss'

export default defineComponent({
  name: 'Button',

  components: {
    Preloader
  },

  props: {
    text: {
      type: String,
      required: true
    },

    id: {
      type: String,
      required: false
    },

    type: {
      type: String,
      required: false,
      default: 'button',
      validator: (value: string) => (['button', 'submit', 'reset'].includes(value))
    },

    mode: {
      type: String,
      required: false,
      default: 'regular'
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
    },

    isLoading: {
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
