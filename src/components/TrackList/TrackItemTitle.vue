<template>  
  <div
    class="tracklist__row-cell --pointer --title"
    @click="() => emit('callLyricsModal')"
  >
    <span
      :title="title"
      class="tracklist__row-title"
    >{{ title }}</span>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title: string
}

interface Emits {
  (e: 'callLyricsModal'): void
}

defineProps<Props>()
const emit = defineEmits<Emits>()
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
