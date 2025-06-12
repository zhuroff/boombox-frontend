<template>
  <div class="search">
    <header
      v-if="isWithHeader"
      class="search__header"
    >
      <slot name="header"></slot>
    </header>
    <div class="search__body">
      <slot name="body"></slot>
    </div>
    <footer
      v-if="isWithFooter"
      class="search__footer"
    >
      <slot name="footer"></slot>
    </footer>
  </div>
</template>

<script setup lang="ts">
interface Props {
  isWithHeader?: boolean
  isWithFooter?: boolean
}

defineProps<Props>()
</script>

<style scoped lang="scss">
@use '~/app/styles/variables' as var;

.search {
  background-color: var.$white;
  border-radius: var.$borderRadiusMD;
  width: 100%;
  align-self: flex-start;
  overflow: hidden;

  @include var.media('>=laptop') {
    max-width: 650px;
  }

  &__body {
    padding: var.$minPadding var.$minPadding 0;
  }

  &__header,
  &__footer {
    letter-spacing: 1px;
    text-align: center;
    padding: var.$minPadding;
    color: var.$paleLT;
    background-color: var.$dark;
  }

  &__header {
    @include var.serif(1rem);
  }

  &__footer {
    font-size: 0.75rem;
    border-top: 1px solid var.$paleMD;
  }
}
</style>
