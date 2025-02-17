<template>
  <div :class="[
    { '--fix' : isOutAlbumAdded },
    'tracklist__row-cell --pointer --add'
  ]">
    <!-- <Button
      v-if="!isOutAlbumAdded"
      icon="chevron-right"
      size="small"
      isText
      :title="localize('player.playNext')"
      @click="() => playTrackNext(track)"
    />
    <Button
      v-if="!isOutAlbumAdded"
      icon="chevron-right-double"
      size="small"
      isText
      :title="localize('player.addToList')"
      @click="() => addToEndOfList(track)"
    /> -->
    <Button
      v-if="isOutAlbumAdded"
      icon="playlist-remove"
      size="small"
      isText
      className="--excluded"
      :title="localize('player.removeFromList')"
      @click="excludeTrack"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import useGlobalStore from '~/store/global'
import usePlaylist from '~/store/playlist'
import Button from '~/components/Button.vue'

interface Props {
  track: Track
}

const props = defineProps<Props>()

const {
  globalGetters: { localize }
} = useGlobalStore()

const {
  playerGetters: { currentPlaylistTracks },
  playerActions: { addToEndOfList, playTrackNext, removeTrackFromPlaylist }
} = usePlaylist()

const isOutAlbumAdded = computed(() => (
  currentPlaylistTracks.value.some(({ _id }) => _id === props.track._id)
))

const excludeTrack = () => {
  removeTrackFromPlaylist(props.track._id)
}
</script>

<style lang="scss">
@import '~/scss/variables';

.tracklist__row {

  &-cell {
    
    &.--add {
      .button {
        fill: $paleDP;
        padding: 0;
        height: 100%;

        &:not(.--excluded) {
          width: 30px;
        }

        &.--excluded {
          width: 100%;

          .icon {
            width: 1.2rem;
          }
        }

        &:hover {
          fill: $white;
          color: $white;
        }

        &.--active {
          border: 1px solid $paleMD;
          background-color: $paleMD;
          border-radius: 50%;
          fill: $white;
          color: $white;

          &:hover {
            fill: $white;
            color: $white;
            stroke: inherit;
          }
        }
      }
    }
  }
}
</style>
