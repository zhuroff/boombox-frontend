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
