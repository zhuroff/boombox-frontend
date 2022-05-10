<template>
  <li class="dropdown__item">
    <label class="dropdown__item-label">
      <input
        type="radio"
        :checked="option.isActive"
        class="dropdown__item-check"
        @change="chooseItem"
      >
      <span class="dropdown__item-title">{{ option.title }}</span>
    </label>
  </li>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { DropdownOption } from '~/types/Global'

export default defineComponent({
  name: 'DropdownItem',

  props: {
    option: {
      type: Object as PropType<DropdownOption<any>>,
      required: true
    }
  },

  setup(props, { emit }) {
    const chooseItem = () => {
      emit('chooseItem', props.option.value)
    }

    return { chooseItem }
  },
})
</script>
