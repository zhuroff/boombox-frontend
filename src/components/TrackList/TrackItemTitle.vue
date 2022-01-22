<template>
  
<div
  class="tracklist__row_cell --pointer"
  @click="callLyricsModal"
>{{ title }}</div>

</template>

<script>

export default {
  props: {
    title: {
      type: String,
      required: true
    }
  },

  setup(props, { emit }) {
    const callLyricsModal = () => (
      emit('callLyricsModal')
    )

    return { callLyricsModal }
  }
}

</script>

<style lang="scss" scoped>

.tracklist__row_cell {
  padding-left: 15px;
  transition: color 0.2s ease;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  flex: 1 1 0;
}

</style>
