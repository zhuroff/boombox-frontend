<template>  
  <div class="tracklist__row-cell --fix --duration">
    {{ trackTime }}
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { secondsToMinutes } from '@/utils'

interface Props {
  duration: number
}

const props = defineProps<Props>()

const trackTime = computed(() => secondsToMinutes(props.duration))
</script>
