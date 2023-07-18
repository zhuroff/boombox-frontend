<template>

<div class="pagination">
  <button
    class="pagination__button"
    :disabled="pagination.page === 1"
    @click="switchPagination(pagination.page - 1)"
  >
    <Sprite name="angle" />
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
    <Sprite name="angle" />
  </button>
</div>

</template>

<script lang="ts">

import { defineComponent, computed, PropType } from 'vue'
import { Pagination } from '~/types/Global'
import Sprite from '~/components/Sprite/Sprite.vue'
import './Pagination.scss'

export default defineComponent({
  name: 'PagePagination',

  components: {
    Sprite
  },

  props: {
    pagination: {
      type: Object as PropType<Pagination>,
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
