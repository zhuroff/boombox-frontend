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
      @click="switchPagination(1)"
    >
      <Sprite name="chevron-left-double" />
    </button>
    <button
      v-if="config.decrement"
      class="paginator__button"
      :disabled="pagination.page === 1"
      @click="switchPagination(pagination.page - 1)"
    >
      <Sprite name="chevron-left" />
    </button>
    <div class="paginator__switcher">
      <button
        v-for="button in buttons"
        :key="button"
        @click="switchPagination(button)"
        :class="[{ '--current' : button === pagination.page }, 'paginator__button']"
      >{{ button }}</button>
    </div>
    <button
      v-if="config.increment"
      class="paginator__button"
      :disabled="pagination.page === config.totalPages"
      @click="switchPagination(pagination.page + 1)"
    >
      <Sprite name="chevron-right" />
    </button>
    <button
      v-if="config.increment"
      class="paginator__button"
      :disabled="pagination.page === config.totalPages"
      @click="switchPagination(config.totalPages)"
    >
      <Sprite name="chevron-right-double" />
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import Sprite from '~/components/Sprite/Sprite.vue'

interface Props {
  pagination: PaginationState
  config: PaginationConfig
  updatePaginationState: PaginationStateSetter
}

const props = defineProps<Props>()

const localLimit = ref(props.pagination.limit)
const localPage = ref(props.pagination.page)

const buttons = computed(() => {
  const minButton = Math.max(1, localPage.value - 2)
  const maxButton = Math.min(minButton + 4, props.config.totalPages)
  const result = []

  for (let i = minButton; i <= maxButton; i++) {
    result.push(i)
  }

  return result
})

const switchPagination = (page: number) => {
  props.updatePaginationState('page', page)
}

watch(
  localLimit,
  (val) => {
    props.updatePaginationState('limit', val)
  }
)
</script>

<style lang="scss" scoped>
@use '~/scss/variables' as var;

.paginator {
  display: flex;
  align-items: center;
  justify-content: center;

  .icon {
    width: 20px;
    height: 20px;
  }

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
    font-size: 1rem;

    &[disabled] {
      opacity: 0.5;
      pointer-events: none;
    }

    &.--current {
      border-radius: var.$borderRadiusSM;
      background-color: var.$dark;
      color: var.$white;
    }
  }

  &__switcher {
    display: flex;
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
    color: var.$paleDP;
    background-color: transparent;
  }
}
</style>
