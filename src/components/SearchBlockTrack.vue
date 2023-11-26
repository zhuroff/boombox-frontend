<template>
  <div class="input-search__results-track">
    <img :src="track.cover" :alt="track.inAlbum.title">
    <div>
      <strong>{{ track.title }}</strong>
      <span>{{ track.artist.title }} - {{ track.inAlbum.title }}</span>
    </div>
    <div class="input-search__results-actions">
      <TrackItemPlay
        :track="trackToPlay"
        :title="'Play now'"
        isSearched
      />
      <Button
        icon="chevron-right"
        size="small"
        isOutlined
        title="Play next"
        :className="activeKeys.has('next') ? '--active' : ''"
        @click="() => (
          !activeKeys.has('next')
            ? playTrackNext('next')
            : removeTrackFromPlaylist('next')
        )"
      />
      <Button
        icon="chevron-right-double"
        size="small"
        isOutlined
        title="Add to playlist"
        :className="activeKeys.has('end') ? '--active' : ''"
        @click="() => (
          !activeKeys.has('end')
            ? addToEndOfList('end')
            : removeTrackFromPlaylist('end')
        )"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { PropType, computed, defineComponent, ref } from 'vue'
import { TrackResponse } from '~/types/Track'
import { usePlayer } from '~/hooks/usePlayer'
import { AlbumTrackDTO } from '~/dto/AlbumTrackDTO'
import TrackItemPlay from '~/components/TrackList/TrackItemPlay.vue'
import Button from '~/components/Button.vue'

export default defineComponent({
  name: 'SearchBlockTrack',
  components: {
    Button,
    TrackItemPlay
  },
  props: {
    track: {
      type: Object as PropType<TrackResponse>,
      required: true
    }
  },
  setup({ track }) {
    const { currentPlaylistTracks, playingTrack, store } = usePlayer()
    const activeKeys = ref(new Set())
    const trackToPlay = computed(() => (
      new AlbumTrackDTO(track, 0, track.cover || '', track.inAlbum.period, true)
    ))

    const playTrackNext = (key: string) => {
      activeKeys.value.add(key)
      const index = currentPlaylistTracks.value.findIndex(
        (track) => track._id === playingTrack.value._id
      ) + 1

      addTrackToPlaylist(index)
    }

    const addToEndOfList = (key: string) => {
      activeKeys.value.add(key)
      const index = currentPlaylistTracks.value.length
      addTrackToPlaylist(index)
    }

    const addTrackToPlaylist = (index: number) => {
      store.commit('appendTrackToPlaylist', {
        index,
        track: trackToPlay.value
      })
    }

    const removeTrackFromPlaylist = (key: string) => {
      activeKeys.value.delete(key)
      store.commit('removeTrackFromPlaylist', trackToPlay.value._id)
    }

    return {
      trackToPlay,
      playTrackNext,
      addToEndOfList,
      removeTrackFromPlaylist,
      activeKeys
    }
  }
})
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
        width: 2rem;
        height: 2rem;
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
