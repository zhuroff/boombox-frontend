<template>
  
<div
  class="tracklist__row_cell --pointer --title"
  @click="callLyricsModal"
>{{ title }}</div>

</template>

<script lang="ts">

import { defineComponent } from 'vue'

export default defineComponent({
  props: {
    title: {
      type: String,
      required: true
    }
  },

  setup(_, { emit }) {
    const callLyricsModal = () => {
      emit('callLyricsModal')
    }

    return { callLyricsModal }
  }
})

</script>

<style lang="scss" scoped>
@import '~/scss/variables';
.tracklist__row_cell {
  padding-left: 15px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  flex: 1 1 0;
}

</style>
