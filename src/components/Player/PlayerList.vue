<template>
  <div class="player__playlist">
    <Button
      icon="playlist"
      isOutlined
      @click="() => isPlaylistOpen = !isPlaylistOpen"
    />
    <Overlay v-if="isPlaylistOpen">
      <ul class="overlay__list">
        <li
          v-for="track in currentPlaylistTracks"
          :class="[{ '--active' : isPlaying(track._id) }, 'overlay__list-item']"
          :key="track._id"
          @click="() => playTrack(track)"
        >
          <div class="player__playlist-cover">
            <img :src="track.albumCover" />
            <Sprite v-if="isPlaying(track._id)" name="playing" />
          </div>
          <div class="player__playlist-info">
            <strong>{{ track.title }}</strong>
            <span>{{ track.artist.title }}</span>
            <span>{{ track.inAlbum.title }}</span>
          </div>
          <time>{{ trackTime(track.duration) }}</time>
        </li>
      </ul>
    </Overlay>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { usePlayer } from '~/hooks/usePlayer'
import { secondsToMinutes } from '~/utils'
import { AlbumTrackDTO } from '~/dto/AlbumTrackDTO'
import Button from '../Button.vue'
import Overlay from '../Overlay.vue'
import Sprite from '../Sprite/Sprite.vue'

export default defineComponent({
  name: 'PlayerList',
  components: {
    Button,
    Overlay,
    Sprite
  },
  setup() {
    const { currentPlaylistTracks, playingTrack, store } = usePlayer()
    const isPlaylistOpen = ref(false)
    const trackTime = (duration: number) => secondsToMinutes(duration)
    const isPlaying = (id: string) => id === playingTrack.value._id

    const playTrack = (track: AlbumTrackDTO) => {
      store.dispatch('playTrack', track)
      store.commit('expandPlayer')
    }

    return {
      isPlaylistOpen,
      playingTrack,
      trackTime,
      isPlaying,
      playTrack,
      currentPlaylistTracks
    }
  }
})
</script>

<style lang="scss">
@import '../../scss/variables.scss';
@import 'include-media';

.player {

  &__playlist {
    display: flex;
    align-items: center;

    &-cover {
      position: relative;
      width: 40px;
      height: 40px;
      margin: 0.25rem 0.875rem 0 0;

      .playing {
        position: absolute;
        width: 25px;
        height: 25px;
        z-index: 10;
        fill: $white;
        color: $white;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }
    }

    &-info {
      line-height: 1.2;
      display: flex;
      flex-direction: column;
      width: calc(100% - 110px);
    }
    
    .button {
      margin-left: 23px;
      width: 25px;
      height: 25px;
      cursor: pointer;
      border: 0;
      background-color: transparent;
      padding: 0;

      .icon {
        width: 24px;
        fill: $white;
      }
    }

    .overlay {
      width: 500px;
      right: 0;
      bottom: $playerHeight;
      height: calc(100vh - #{$playerHeight});
      overflow: auto;

      &__list {

        &-item {
          display: flex;
          align-items: flex-start;

          img {
            width: inherit;
            height: inherit;
            object-fit: cover;
            border-radius: $borderRadiusSM;
            max-height: 100%;
            display: block;
          }

          strong {
            text-overflow: ellipsis;
            white-space: nowrap;
            overflow: hidden;
            font-size: 0.875rem;
          }

          span {
            font-size: 0.75rem;
            color: $paleDP;
            text-overflow: ellipsis;
            white-space: nowrap;
            overflow: hidden;
          }

          time {
            margin-left: auto;
            color: $paleDP;
            font-size: 0.875rem;
          }

          &:hover {
            background-color: $paleLT;
            transition: background-color 0.3s $animation;
            color: $black;
          }

          &.--active {
            background-color: $dark;

            strong {
              color: $white;
            }

            span,
            time {
              color: $paleMD;
            }
          }
        }
      }
    }
  }
}
</style>
