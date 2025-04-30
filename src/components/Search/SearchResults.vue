<template>
  <div class="search__results">
    <Preloader
      v-if="isFetching"
      mode="light"
    />
    <div
      v-if="isEmpty"
      class="search__empty"
    >
      There are no results
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
import Preloader from '~/components/Preloader.vue'

interface Props {
  isEmpty: boolean
  isFetching: boolean
}

defineProps<Props>()
</script>

<style scoped lang="scss">
@use '~/scss/variables' as var;

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
