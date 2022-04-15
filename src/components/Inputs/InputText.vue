<template>
  <input
    :type="type"
    :placeholder="placeholder"
    :value="value"
    class="input"
    spellcheck="false"
    @input="emitInputValue"
  />
</template>

<script lang="ts">

import { defineComponent } from 'vue'

export default defineComponent({
  props: {
    type: {
      type: String,
      required: true,
      validator: (value: string) => (
        ['password', 'text', 'number', 'search', 'email', 'tel'].includes(value)
      )
    },

    placeholder: {
      type: String,
      required: false,
      default: ''
    },

    value: {
      type: String,
      required: false,
      default: ''
    }
  },

  setup(props, { emit }) {
    const emitInputValue = (event: InputEvent) => {
      emit('setInputValue', (event.target as HTMLInputElement).value)
    }

    return {
      emitInputValue
    }
  },
})

</script>

<style lang="scss" scoped>

@import '~/scss/variables';

.input {
  width: 100%;
  height: 40px;
  border-radius: 3px;
  border: 1px solid $border;
  padding: 0 10px;
  font-size: 14px;
}

</style>
