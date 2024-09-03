<template>
  <div class="tracklist__row-cell --pointer --fix">
    <Button
      icon="disable"
      size="small"
      isText
      className="tracklist__row-action"
      @click="() => disableOrEnableTrack(fileid)"
    />
  </div>
</template>

<script setup lang="ts">
import usePlaylist from '~/store/playlist'
import Button from '~/components/Button.vue'

interface Props {
  fileid: string
}

defineProps<Props>()

const {
  playerActions: { disableOrEnableTrack }
} = usePlaylist()
</script>

<style lang="scss" scoped>
@import '~/scss/variables';
.tracklist__row {

  &.--playing {
    .tracklist__row-cell {
      opacity: 0.25;
      pointer-events: none;
    }
  }

  &-action {

    &:hover {
      fill: inherit;
      stroke: inherit;
      color: $white;
    }
  }
}
</style>
