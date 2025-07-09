<template>
  <div class="input-search__results-track">
    <img
      :alt="track.inAlbum.title"
      :src="track?.coverURL || '/img/album.webp'"
    >
    <div>
      <strong>{{ track.title }}</strong>
      <span>
        {{ track.artist.title }} - {{ track.inAlbum.title }}
      </span>
    </div>
    <!-- <div class="input-search__results-actions">
      <TrackItemPlay
        :track="trackToPlay"
        :title="localize('player.playNow')"
        :isTOY="false"
        isSearched
      />
      <Button 
        v-if="!isOutAlbumAdded"
        icon="chevron-right"
        size="small"
        :title="localize('player.playNext')"
        @click="() => playTrackNext(trackToPlay)"
      />
      <Button
        v-if="!isOutAlbumAdded"
        icon="chevron-right-double"
        size="small"
        :title="localize('player.addToList')"
        @click="() => addToEndOfList(trackToPlay)"
      />
      <Button
        v-if="isOutAlbumAdded"
        icon="playlist-remove"
        size="small"
        :title="localize('player.removeFromList')"
        @click="() => removeTrackFromPlaylist(trackToPlay._id)"
      />
    </div>  -->
  </div>
</template>

<script setup lang="ts">
import { useLocalization } from '~shared/model'
// import usePlaylist from '~/store/playlist'
// import AlbumTrack from '~/classes/AlbumTrack'
import TrackItemPlay from '~/~legacy/components/TrackList/TrackItemPlay.vue'
import { Button } from '~shared/UI'
import type { TrackRes } from '~shared/lib'

interface Props {
  track: TrackRes
}

const props = defineProps<Props>()

const { localize } = useLocalization()

// const {
//   playerGetters: { currentPlaylistTracks },
//   playerActions: { playTrackNext, addToEndOfList, removeTrackFromPlaylist }
// } = usePlaylist()

// const trackToPlay = computed(() => (
//   new AlbumTrack(props.track, 0, props.track.coverURL, true)
// ))

// const isOutAlbumAdded = computed(() => (
//   currentPlaylistTracks.value.some(({ _id }) => _id === trackToPlay.value._id)
// ))
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
        background-color: var.$paleLT;
        transition: background-color 0.3s var.$animation;
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
        border: 1px solid var.$paleDP;
        fill: var.$paleDP;

        &:hover {
          background-color: var.$paleDP;
          fill: var.$white;
        }

        &.--active {
          background-color: var.$paleDP;
          fill: var.$white;
        }
      }
    }
  }
}
</style>
