<template>
  <div class="paginator">
    <Select
      v-if="paginationConfig.limiter?.length"
      :options="paginationConfig.limiter"
      :isMarkedSelected="false"
      :selected="selectedLimit"
      entityKey="paginationLimit"
      isText
      @update:select="switchLimit"
    />
    <Button
      v-if="paginationConfig.decrement"
      icon="chevron-left-double"
      isText
      :disabled="paginationState.page === 1"
      @click="switchPagination(1)"
    />
    <Button
      v-if="paginationConfig.decrement"
      icon="chevron-left"
      isText
      :disabled="paginationState.page === 1"
      @click="switchPagination(paginationState.page - 1)"
    />
    <div class="paginator__switcher">
      <Button
        v-for="button in buttons"
        :key="button"
        isText
        @click="switchPagination(button)"
        :class="[{ '--current' : button === paginationState.page }]"
      >{{ button }}</Button>
    </div>
    <Button
      v-if="paginationConfig.increment"
      icon="chevron-right"
      isText
      :disabled="paginationState.page === paginationConfig.totalPages"
      @click="switchPagination(paginationState.page + 1)"
    />
    <Button
      v-if="paginationConfig.increment"
      icon="chevron-right-double"
      isText
      :disabled="paginationState.page === paginationConfig.totalPages"
      @click="switchPagination(paginationConfig.totalPages)"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import type { PaginationState, PaginationConfig, PaginationStateSetter } from '~widgets/paginator'
import { Select, Button } from '~shared/UI'

interface Props {
  paginationState: PaginationState
  paginationConfig: PaginationConfig
  updatePaginationState: PaginationStateSetter
}

const props = defineProps<Props>()

const localPage = ref(props.paginationState.page)

const buttons = computed(() => {
  const minButton = Math.max(1, localPage.value - 2)
  const maxButton = Math.min(minButton + 4, props.paginationConfig.totalPages)
  const result = []

  for (let i = minButton; i <= maxButton; i++) {
    result.push(i)
  }

  return result
})

const selectedLimit = computed(() => ({
  paginationLimit: props.paginationState.limit
}))

const switchPagination = (page: number) => {
  props.updatePaginationState('page', page)
}

const switchLimit = (payload: [string, number | string | null]) => {
  const [_, value] = payload

  if (!value) return
  
  props.updatePaginationState('limit', Number(value))
}
</script>

<style lang="scss" scoped>
@use '~/app/styles/variables' as var;

.paginator {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: var.$mainPadding;

  .icon {
    width: 20px;
    height: 20px;
  }

  .button {
    width: var.$elementHeightMD;
    height: var.$elementHeightMD;

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
    padding: 0 var.$basicPadding;
    margin: 0 var.$basicPadding;
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
