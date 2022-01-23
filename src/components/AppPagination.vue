<template>

<div class="pagination">
  <button
    class="pagination__button"
    :disabled="currentPage === 1"
    @click="switchPagination(currentPage - 1)"
  >
    <AppSprite name="angle" />
  </button>

  <select
    v-if="isSelectable"
    class="pagination__select"
    @input="switchPagination(Number($event.target.value))"
  >
    <option
      v-for="option in options"
      :key="option"
      :value="option"
      :selected="option === currentPage"
    >{{ option }} of {{ options.length }}</option>
  </select>

  <button
    class="pagination__button"
    :disabled="currentPage === totalPages"
    @click="switchPagination(currentPage + 1)"
  >
    <AppSprite name="angle" />
  </button>
</div>

</template>

<script lang="ts">

import { defineComponent, computed } from 'vue'
import AppSprite from '~/components/AppSprite.vue'

export default defineComponent({
  components: {
    AppSprite
  },

  props: {
    totalPages: {
      type: Number,
      required: true
    },

    currentPage: {
      type: Number,
      required: true
    },

    isSelectable: {
      type: Boolean,
      required: false,
      default: true
    }
  },

  setup(props, { emit }) {
    const options = computed(() => (
      Array.from({ length: props.totalPages }, (a, b) => (b + 1))
    ))

    const switchPagination = (page: number) => {
      if (page !== props.currentPage) {
        emit('switchPagination', page)
      }
    }

    return {
      options,
      switchPagination
    }
  }
})

</script>

<style lang="scss" scoped>

@import '~/scss/variables';

.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: auto 0 25px;

  &__button {
    height: 40px;
    width: 40px;
    cursor: pointer;
    border: 0;
    background-color: transparent;
    outline: none;
    display: flex;
    justify-content: center;
    align-items: center;

    &:first-child {
      transform: rotate(180deg);
    }

    &[disabled] {
      opacity: 0.5;
      pointer-events: none;
    }

    .icon-angle {
      fill: $dark;
      width: 15px;
      height: 15px;
    }
  }

  &__select {
    height: 40px;
    min-width: 40px;
    padding: 0 10px;
    margin: 0 10px;
    cursor: pointer;
    text-align: center;
    border: 0;
    outline: none;
    font-family: inherit;
    font-size: 18px;
    color: $pale;
    background-color: transparent;
  }
}

</style>
