<template>
  <div class="confirmation">
    <div class="confirmation__message">{{ message }}</div>
    <div class="confirmation__actions">
      <slot name="actions"></slot>
    </div>
    <slot name="loader"></slot>
  </div>
</template>

<script setup lang="ts">
interface Props {
  message: string
}

defineProps<Props>()
</script>

<style lang="scss" scoped>
@use '~/app/styles/variables' as var;

.confirmation {
  background-color: var.$paleLT;
  border-radius: var.$borderRadiusMD;
  padding: var.$mainPadding;
  position: relative;

  &__message {
    text-align: center;
    margin-bottom: 1rem;
    color: var.$black;
    font-weight: 600;
  }

  &__actions {
    display: flex;
    justify-content: flex-end;
    gap: 1rem
  }

  .preloader {
    height: 100%;
  }
}
</style>
