<template>
  <li
    :class="[{ '--active' : isTrackPlaying }, 'playlist__track']"
    @click="() => playTrack(track)"
  >
    <div class="playlist__track-cover">
      <img
        :src="track.albumCover"
        referrerpolicy="no-referrer"
      />
      <Sprite
        v-if="isTrackPlaying"
        name="playing"
      />
    </div>

    <div class="playlist__track-info">
      <strong>{{ trackTitle }}</strong>
      <div>
        <span>{{ track.artist.title }} | </span>
        <span>{{ track.inAlbum.title }}</span>
      </div>
    </div>

    <time class="playlist__track-duration">
      {{ trackDuration }}
    </time>

    <Button
      icon="close"
      size="small"
      isText
      isInverted
      @click.stop="() => toggleTrackAvailability(track)"
    />
  </li>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { usePlayer, type PlaylistTrack } from '~features/player'
import { usePlaylistService } from '~features/player'
import { secondsToMinutes } from '~shared/utils'
import { Sprite, Button } from '~shared/UI'

type Props = {
  order: number
  track: PlaylistTrack
}

const props = defineProps<Props>()

const { playTrack, playingTrack } = usePlayer()
const { toggleTrackAvailability } = usePlaylistService()

const trackTitle = computed(() => (
  (props.order < 10 ? `0${props.order}` : props.order) + `. ${props.track.title}`
))

const trackDuration = computed(() => {
  return secondsToMinutes(props.track.duration)
})

const isTrackPlaying = computed(() => {
  return playingTrack.value?._id === props.track._id
})
</script>

<style lang="scss">
@use '~app/styles/variables' as var;

.playlist__track {
  display: flex;
  align-items: center;
  padding-right: 0;
  cursor: pointer;
  padding: 0.25rem 0.5rem 0.25rem 0.75rem;

  &.--active,
  &:hover {
    background-color: var.$dark;

    strong {
      color: var.$white;
      transition: color 0.1s var.$animation;
    }

    span,
    time {
      color: var.$white;
      transition: color 0.1s var.$animation;
    }

    .button {

      .icon {
        color: var.$white;
        transition: color 0.1s var.$animation;
      }
    }
  }

  &-cover {
    position: relative;
    width: 40px;
    height: 40px;
    margin: 0rem 0.875rem 0 0;

    img {
      width: inherit;
      height: inherit;
      object-fit: cover;
      border-radius: var.$borderRadiusSM;
      max-height: 100%;
      display: block;
    }

    .playing {
      position: absolute;
      width: 25px;
      height: 25px;
      z-index: 10;
      fill: var.$white;
      color: var.$white;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  }

  &-info {
    line-height: 1.2;
    width: calc(100% - 110px);
    padding-right: 1rem;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;

    strong {
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
      font-size: 0.875rem;
      color: var.$black;
      transition: all 0.1s var.$animation;
    }

    span {
      font-size: 0.75rem;
      color: var.$black;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
      transition: all 0.1s var.$animation;
    }
  }

  &-duration {
    margin-left: auto;
    color: var.$black;
    white-space: nowrap;
    font-size: 0.875rem;
    transition: all 0.1s var.$animation;
  }

  .button {

    .icon {
      color: var.$black;
    }
  }
}
</style>