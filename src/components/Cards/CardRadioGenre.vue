<template>
  <li class="station__tag">
    <button
      :class="[{ '--active' : isActive }, 'station__tag-button']"
      @click="fetchByGenre"
    >{{ genre }}</button>
  </li>
</template>

<script lang="ts">

import { defineComponent } from 'vue'

export default defineComponent({
  name: 'CardRadioGenre',

  props: {
    genre: {
      type: String,
      required: true
    },

    isActive: {
      type: Boolean,
      required: true
    }
  },

  setup(props, { emit }) {
    const fetchByGenre = () => emit('fetchByGenre', props.genre)

    return { fetchByGenre }
  }
})

</script>

<style lang="scss" scoped>

@import '@/scss/variables';

.station__tag {

  &-button {
    padding: 2px 7px;
    border: 0;
    background-color: transparent;
    outline: none;
    color: $pale;
    font-size: 12px;
    border-radius: 3px;
    transition: all 0.2s ease;

    &:hover {
      background-color: $white;
      box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
      transition: all 0.2s ease;
    }

    &.--selected {
      background-color: $white;
      box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
    }
  }
}

</style>
