<template>
  <div class="paginator">
    <select
      v-if="config.limiter?.length"
      class="paginator__select"
      v-model="localLimit"
    >
      <option
        v-for="option in config.limiter"
        :key="option"
        :value="option"
        :selected="option === config.selected"
      >{{ option }}</option>
    </select>
    <button
      v-if="config.decrement"
      class="paginator__button"
      :disabled="pagination.page === 1"
      @click="switchPagination(pagination.page - 1)"
    >
      <Sprite name="angle" />
    </button>
    <div
      v-if="config.view === 'buttons'"
      class="paginator__switcher"
    >
      <button
        v-for="option in options"
        @click="switchPagination(option)"
        :style="{ backgroundColor: option === pagination.page ? 'yellow' : 'transparent' }"
      >{{ option }}</button>
    </div>
    <select
      v-else
      class="paginator__select"
      v-mode="localPage"
    >
      <option
        v-for="option in options"
        :key="option"
        :value="option"
        :selected="option === pagination.page"
      >{{ option }} of {{ options.length }}</option>
    </select>
    <button
      v-if="config.increment"
      class="paginator__button"
      :disabled="pagination.page === pagination.totalPages"
      @click="switchPagination(pagination.page + 1)"
    >
      <Sprite name="angle" />
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, PropType, ref, watchEffect, watch } from 'vue'
import { Pagination, PaginationConfig } from '~/types/Global'
import Sprite from '~/components/Sprite/Sprite.vue'

export default defineComponent({
  name: 'Paginator',

  components: {
    Sprite
  },

  props: {
    pagination: {
      type: Object as PropType<Pagination>,
      required: true
    },
    config: {
      type: Object as PropType<PaginationConfig>,
      required: true
    }
  },

  setup({ pagination }, { emit }) {
    const localLimit = ref(pagination.limit)
    const localPage = ref(pagination.page)
    const options = computed(() => (
      Array.from({ length: pagination.totalPages }, (a, b) => ++b)
    ))

    const switchPagination = (page: number) => {
      localPage.value = page
    }

    // watchEffect(() => {
    //   if (localLimit.value !== pagination.limit) {
    //     console.log('localLimit.value', localLimit.value)
    //     emit('changeLimit', localLimit.value)
    //   }
    // })

    // watchEffect(() => {
    //   if (localPage.value !== pagination.page) {
    //     console.log('localPage.value', localPage.value)
    //     emit('switchPagination', localPage.value)
    //   }
    // })

    return {
      options,
      localLimit,
      localPage,
      switchPagination
    }
  }
})
</script>

<style lang="scss" scoped>
@import '../scss/variables.scss';
@import 'include-media';

.paginator {
  display: flex;
  align-items: center;
  justify-content: center;

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

    &:first-of-type {
      transform: rotate(180deg);
    }

    &[disabled] {
      opacity: 0.5;
      pointer-events: none;
    }

    .icon {
      color: $dark;
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
