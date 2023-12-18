<template>
  <div class="input-search__results-track">
    <img :src="track?.coverURL || '/img/album.webp'" :alt="track.inAlbum.title">
    <div>
      <strong>{{ track.title }}</strong>
      <span>{{ track.artist.title }} - {{ track.inAlbum.title }}</span>
    </div>
    <div class="input-search__results-actions">
      <TrackItemPlay
        :track="trackToPlay"
        :title="lang('player.playNow')"
        isSearched
      />
      <Button 
        v-if="!isOutAlbumAdded"
        icon="chevron-right"
        size="small"
        isOutlined
        :title="lang('player.playNext')"
        @click="() => playTrackNext(trackToPlay)"
      />
      <Button
        v-if="!isOutAlbumAdded"
        icon="chevron-right-double"
        size="small"
        isOutlined
        :title="lang('player.addToList')"
        @click="() => addToEndOfList(trackToPlay)"
      />
      <Button
        v-if="isOutAlbumAdded"
        icon="playlist-remove"
        size="small"
        isOutlined
        :title="lang('player.removeFromList')"
        @click="() => removeTrackFromPlaylist(trackToPlay._id)"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { PropType, computed, defineComponent, ref } from 'vue'
import { useLocales } from '~/hooks/useLocales'
import store from '~/store'
import AlbumTrack from '~/classes/AlbumTrack'
import TrackItemPlay from '~/components/TrackList/TrackItemPlay.vue'
import Button from '~/components/Button.vue'
import { TrackRes } from '~/types/ReqRes'

export default defineComponent({
  name: 'SearchBlockTrack',
  components: {
    Button,
    TrackItemPlay
  },
  props: {
    track: {
      type: Object as PropType<TrackRes>,
      required: true
    }
  },
  setup({ track }) {
    const { lang } = useLocales()
    const { actions, getters } = store
    const trackToPlay = computed(() => (
      new AlbumTrack(track, 0, track.inAlbum.period.title, track.coverURL, true)
    ))
    const isOutAlbumAdded = computed(() => (
      getters.currentPlaylistTracks.value.some(({ _id }) => _id === trackToPlay.value._id)
    ))

    return {
      lang,
      trackToPlay,
      isOutAlbumAdded,
      playTrackNext: actions.playTrackNext,
      addToEndOfList: actions.addToEndOfList,
      removeTrackFromPlaylist: actions.removeTrackFromPlaylist
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
