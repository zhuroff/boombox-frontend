<template>  
  <div class="tracklist__row-cell --fix --duration">
    {{ trackTime }}
  </div>
</template>

<script>
import { defineComponent, computed } from 'vue'
import { secondsToMinutes } from '@/utils'

export default defineComponent({
  props: {
    duration: {
      required: false
    }
  },
  setup(props) {
    const trackTime = computed(() => secondsToMinutes(props.duration))
    return { trackTime }
  }
})
</script>
