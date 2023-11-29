<template>
  <div class="text-input">
    <input
      :class="[
        'text-input__element',
        `--${size}`
      ]"
      :placeholder="placeholder"
      v-model="value"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue'

export default defineComponent({
  name: 'TextInput',
  props: {
    placeholder: {
      type: String,
      required: false
    },
    size: {
      type: String,
      required: false,
      default: 'medium',
      validator: (value: string) => ['small', 'medium', 'large'].includes(value)
    },
    inputValue: {
      type: String,
      required: false
    }
  },
  setup({ inputValue }, { emit }) {
    const value = ref(inputValue || '')

    watch(value, (newValue) => {
      emit('setInputValue', newValue)
    })

    return { value }
  }
})
</script>

<style lang="scss" scoped>
@import '../scss/variables.scss';
@import 'include-media';

.text-input {
  flex-grow: 1;
  position: relative;

  &__element {
    border-radius: $borderRadiusSM;
    border: 1px solid $paleDP;
    width: 100%;

    &.--medium {
      padding: .5rem 1rem;
      font-size: .875rem;
      height: 36px;
    }
  }
}
</style>
