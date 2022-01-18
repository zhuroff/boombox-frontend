<template>
  <button
    class="button"
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
    }
  },

  setup(props, { emit }) {
    const emitButtonClick = () => emit('onClick')

    return { emitButtonClick }
  }
})

</script>

