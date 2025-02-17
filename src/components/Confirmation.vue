<template>
  <div class="confirmation">
    <div class="confirmation__message">{{ message }}</div>
    <div class="confirmation__actions">
      <Button
        label="delete"
        @click="() => $emit('confirm')"
      />
      <Button
        label="cancel"
        @click="() => $emit('reject')"
      />
    </div>
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import Button from '~/components/Button.vue'

interface Props {
  message: string
}

defineProps<Props>()
</script>

<style lang="scss">
@import '~/scss/variables';
@import 'include-media';

.confirmation {
  // background-color: $white;
  background-color: $paleLT;
  border-radius: $borderRadiusMD;
  padding: 25px;
  position: relative;

  &__message {
    text-align: center;
    margin-bottom: 1rem;
    color: $black;
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
