<template>
  
<div class="tracklist__row_cell --fix --duration">{{ secondsToMinutes }}</div>

</template>

<script>

import { defineComponent, computed } from 'vue'

export default defineComponent({
  props: {
    duration: {
      required: false
    }
  },

  setup(props) {
    const secondsToMinutes = computed(() => {
      if (!props.duration) {
        return '--/--'
      }

      const minutes = Math.floor(props.duration / 60)
      const seconds = Math.floor(props.duration - minutes * 60)

      return `${minutes}:${seconds >= 10 ? seconds : `0${seconds}`}`
    })

    return { secondsToMinutes }
  }
})

</script>
