<template>
  <div class="input-search__results-track">
    <img
      :alt="track.inAlbum.title"
      :src="trackCover"
    >
    <div>
      <strong>{{ track.title }}</strong>
      <span>
        {{ track.artist.title }} - {{ track.inAlbum.title }}
      </span>
    </div>
    <div class="input-search__results-actions">
      <Button
        :icon="!playingTrack || playingTrack._id !== track._id ? 'play' : 'playing'"
        :isBorderless="playingTrack?._id === track._id"
        :isDisabled="playingTrack?._id === track._id"
        :title="localize('player.playNow')"
        @click="playNow"
      />
      <Button
        v-if="!!playingTrack && !isTrackInPlaylist(track._id)"
        icon="next"
        :title="localize('player.playNext')"
        @click="() => addTrackToPlaylist(track, playingTrackIndex)"
      />
      <Button
        v-if="!!playingTrack && !isTrackInPlaylist(track._id)"
        icon="playlist"
        :title="localize('player.addToList')"
        @click="() => addTrackToPlaylist(track)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useLocalization } from '~shared/model'
import { proxyCloudUrl } from '~shared/lib'
import { Button } from '~shared/UI'
import { usePlayer } from '~features/player'
import { usePlaylistService } from '~features/player'
import type { TrackBasic } from '~entities/track'

interface Props {
  track: TrackBasic
}

const props = defineProps<Props>()

const { localize } = useLocalization()
const { playingTrack, playingTrackIndex, playTrack, playNext } = usePlayer()
const { isTrackInPlaylist, addTrackToPlaylist } = usePlaylistService()

const trackCover = computed(() => proxyCloudUrl(props.track.coverURL) || '/img/album.webp')

const playNow = () => {
  if (isTrackInPlaylist(props.track._id)) {
    playTrack(props.track)
  } else {
    addTrackToPlaylist(props.track, playingTrackIndex.value)
    playingTrack.value ? playNext() : playTrack(props.track)
  }
}
</script>

<style lang="scss">
@use '~/app/styles/variables' as var;

.input-search {

  &__results {

    &-track {
      padding: 5px;
      display: flex;
      align-items: center;
      transition: background-color 0.3s var.$animation;

      &:hover {
        @include var.media('>=desktop') {
          background-color: var.$paleLT;
          transition: background-color 0.3s var.$animation;
        }
      }

      img {
        width: 50px;
        height: 50px;
        object-fit: cover;
        border-radius: var.$borderRadiusSM;
        grid-row: span 2;
        max-height: 100%;
        display: block;
        margin-right: 0.875rem;
      }

      strong {
        color: var.$black;
        display: block;
      }

      span {
        font-size: 0.875rem;
        color: var.$paleDP;
      }
    }

    &-actions {
      display: flex;
      align-items: center;
      margin-left: auto;

      & > * {
        margin-left: var.$basicPadding;
      }

      .tracklist__row-cell {
        margin: 0;
        width: auto !important;
      }

      .button {
        border-radius: 50%;
        padding: 0;
        width: 2rem !important;
        height: 2rem !important;
        border: 1px solid var.$dark;
        
        .icon {
          fill: var.$dark;
          color: var.$dark;
        }

        &:hover,
        &.--active {
          background-color: var.$dark;
          
          .icon {
            fill: var.$white;
            color: var.$white;
          }
        }
      }
    }
  }
}
</style>
