<template>
  <div class="search__results">
    <Loader
      v-if="isFetching"
      mode="light"
    />
    <div
      v-if="isEmpty"
      class="search__empty"
    >
      {{ localize('search.empty') }}
    </div>
    <div
      v-else
      class="search__data"
    >
      <slot name="results"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useTranslate } from '~features/localization'
import { Loader } from '~shared/UI'

interface Props {
  isEmpty: boolean
  isFetching: boolean
}

defineProps<Props>()

const { localize } = useTranslate()
</script>

<style scoped lang="scss">
@use '~/app/styles/variables' as var;

.search {

  &__results {
    min-height: 120px;
    max-height: calc(100vh - var.$doublePadding * 4 - var.$minPadding * 2);
    display: flex;
    flex-direction: column;
    overflow: auto;
    margin: var.$minPadding 0;
    position: relative;
  }

  &__empty {
    flex: 1 1 0;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>
