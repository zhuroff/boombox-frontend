<template>
  
<div class="tracklist__row_cell --fix">{{ secondsToMinutes }}</div>

</template>

<script>

import { computed } from 'vue'

export default {
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
}

</script>
