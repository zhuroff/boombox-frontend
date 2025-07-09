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
import { useLocalization } from '~shared/model'
import usePlaylist from '../../store/playlist'
import { Button } from '~shared/UI'

interface Props {
  track: Track
}

const props = defineProps<Props>()

const { localize } = useLocalization()

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
@use '~/app/styles/variables' as var;

.tracklist__row {

  &-cell {
    
    &.--add {
      .button {
        fill: var.$paleDP;
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
          fill: var.$white;
          color: var.$white;
        }

        &.--active {
          border: 1px solid var.$paleMD;
          background-color: var.$paleMD;
          border-radius: 50%;
          fill: var.$white;
          color: var.$white;

          &:hover {
            fill: var.$white;
            color: var.$white;
            stroke: inherit;
          }
        }
      }
    }
  }
}
</style>
