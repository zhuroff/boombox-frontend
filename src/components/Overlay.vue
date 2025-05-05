<template>
  <div class="overlay">
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'

interface Emits {
  (e: 'closeOverlay'): void
}

const emit = defineEmits<Emits>()

const isMounted = ref(false)
const clickWatcher = (event: MouseEvent) => {
  if (!isMounted.value) {
    return isMounted.value = true
  }

  if (!(event.target as Element)?.closest('.overlay')) {
    emit('closeOverlay')
    document.body.removeEventListener('click', clickWatcher)
  }
}

onMounted(() => {
  document.body.addEventListener('click', clickWatcher)
})

onUnmounted(() => {
  document.body.removeEventListener('click', clickWatcher)
})
</script>

<style lang="scss" scoped>
@use '~/scss/variables' as var;

.overlay {
  position: absolute;
  z-index: 1000;
  border-radius: var.$borderRadiusMD;
  background-color: var.$paleLT;
  box-shadow: var.$shadowMedium;

  &__list {
    padding: 0.75rem 0;

    &-item {
      padding: 0.25rem 1rem;
      cursor: pointer;
      line-height: 1.5;

      &:hover {
        background-color: var.$dark;
        color: var.$white;
      }
    }
  }
}
</style>
