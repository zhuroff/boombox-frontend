<template>
  <div class="input-search__results-track">
    <img :src="track?.coverURL || '/img/album.webp'" :alt="track.inAlbum.title">
    <div>
      <strong>{{ track.title }}</strong>
      <span>{{ track.artist.title }} - {{ track.inAlbum.title }}</span>
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
import { computed } from 'vue'
import useGlobalStore from '~/store/global'
import usePlaylist from '~/store/playlist'
import AlbumTrack from '~/classes/AlbumTrack'
import TrackItemPlay from '~/components/TrackList/TrackItemPlay.vue'
import Button from '~/components/Button.vue'
import { TrackRes } from '~/types/ReqRes'

interface Props {
  track: TrackRes
}

const props = defineProps<Props>()

const {
  globalGetters: { localize }
} = useGlobalStore()

const {
  playerGetters: { currentPlaylistTracks },
  playerActions: { playTrackNext, addToEndOfList, removeTrackFromPlaylist }
} = usePlaylist()

// const trackToPlay = computed(() => (
//   new AlbumTrack(props.track, 0, props.track.coverURL, true)
// ))

// const isOutAlbumAdded = computed(() => (
//   currentPlaylistTracks.value.some(({ _id }) => _id === trackToPlay.value._id)
// ))
</script>

<style lang="scss">
@import '~/scss/variables';

.input-search {

  &__results {

    &-track {
      padding: 5px 25px;
      display: flex;
      align-items: center;
      transition: background-color 0.3s $animation;

      &:hover {
        background-color: $paleLT;
        transition: background-color 0.3s $animation;
      }

      img {
        width: 50px;
        height: 50px;
        object-fit: cover;
        border-radius: $borderRadiusSM;
        grid-row: span 2;
        max-height: 100%;
        display: block;
        margin-right: 0.875rem;
      }

      strong {
        color: $black;
        display: block;
      }

      span {
        font-size: 0.875rem;
        color: $paleDP;
      }
    }

    &-actions {
      display: flex;
      align-items: center;
      margin-left: auto;

      & > * {
        margin-left: 10px;
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
        border: 1px solid $paleDP;
        fill: $paleDP;

        &:hover {
          background-color: $paleDP;
          fill: $white;
        }

        &.--active {
          background-color: $paleDP;
          fill: $white;
        }
      }
    }
  }
}
</style>
