<template>
  <div>{{ eee }}</div>
</template>

<script setup lang="ts">
const props = defineProps({
  eee: {
    type: Number,
    required: true
  }
})
</script>
