<template>  
  <div
    class="tracklist__row-cell --pointer --title"
    @click="callLyricsModal"
  >
    <span class="tracklist__row-title">{{ title }}</span>
  </div>
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
.tracklist__row {

  &-cell {
    padding-left: 15px;    
    overflow: hidden;

    &.--title {
      flex-grow: 1;
    }
  }

  &-title {
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
}
</style>
