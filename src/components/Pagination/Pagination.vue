<template>

<div class="pagination">
  <button
    class="pagination__button"
    :disabled="pagination.page === 1"
    @click="switchPagination(pagination.page - 1)"
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
      :selected="option === pagination.page"
    >{{ option }} of {{ options.length }}</option>
  </select>

  <button
    class="pagination__button"
    :disabled="pagination.page === pagination.totalPages"
    @click="switchPagination(pagination.page + 1)"
  >
    <AppSprite name="angle" />
  </button>
</div>

</template>

<script lang="ts">

import { defineComponent, computed, PropType } from 'vue'
import { TPagination } from '~/types/Global'
import AppSprite from '~/components/AppSprite.vue'
import './Pagination.scss'

export default defineComponent({
  name: 'Pagination',

  components: {
    AppSprite
  },

  props: {
    pagination: {
      type: Object as PropType<TPagination>,
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
      Array.from({ length: props.pagination.totalPages }, (a, b) => (b + 1))
    ))

    const switchPagination = (page: number) => {
      if (page !== props.pagination.page) {
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
