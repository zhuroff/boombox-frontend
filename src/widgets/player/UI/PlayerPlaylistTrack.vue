<template>
  <li
    :class="[{ '--active' : isTrackPlaying }, 'playlist__track']"
    @click="() => playTrack(track)"
  >
    <Button
      icon="drag"
      size="small"
      isText
      className="playlist__track-drag"
      :isDisabled="track?.idDisabled"
    />
    <div class="playlist__track-cover">
      <img
        :src="proxiedAlbumCover"
        referrerpolicy="no-referrer"
      />
      <Sprite
        v-if="isTrackPlaying"
        name="playing"
      />
    </div>

    <div class="playlist__track-info">
      <strong>{{ trackTitle }}</strong>
      <div class="playlist__track-sign">
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
      className="playlist__track-disable"
      :isDisabled="isTrackPlaying"
      @click.stop="() => toggleTrackAvailability(track)"
    />
  </li>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { usePlayer, type PlaylistTrack } from '~features/player'
import { usePlaylistService } from '~features/player'
import { proxyCloudUrl } from '~shared/lib'
import { secondsToMinutes } from '~shared/utils'
import { Sprite, Button } from '~shared/UI'

type Props = {
  order: number
  track: PlaylistTrack
}

const props = defineProps<Props>()

const { playTrack, playingTrack } = usePlayer()
const { toggleTrackAvailability } = usePlaylistService()

const proxiedAlbumCover = computed(() => proxyCloudUrl(props.track.albumCover))

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
  cursor: pointer;

  @include var.media('<desktop') {
    padding: 0.25rem 0;
  }

  @include var.media('>=desktop') {
    padding: 0.25rem 0.5rem 0.25rem 0.75rem;
  }

  &.--active {
    background-color: var.$dark;

    strong {
      color: var.$light;
      transition: color 0.1s var.$animation;
    }

    time,
    .playlist__track-sign {
      color: var.$light;
      transition: color 0.1s var.$animation;
    }

    .button {

      .icon {
        color: var.$light;
        fill: var.$light;
        transition: color 0.1s var.$animation;
      }
    }
  }

  &:hover {
    @include var.media('>=desktop') {
      background-color: var.$dark;

      strong {
        color: var.$light;
        transition: color 0.1s var.$animation;
      }

      time,
      .playlist__track-sign {
        color: var.$light;
        transition: color 0.1s var.$animation;
      }

      .button {

        .icon {
          color: var.$light;
          transition: color 0.1s var.$animation;
        }
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
      width: var.$mainPadding;
      height: var.$mainPadding;
      z-index: 10;
      fill: var.$light;
      color: var.$light;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  }

  &-info {
    line-height: 1.2;
    width: calc(100% - 110px);
    margin-right: 1rem;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;

    strong {
      font-size: 0.875rem;
      transition: all 0.1s var.$animation;
    }

    span {
      font-size: 0.75rem;
      transition: all 0.1s var.$animation;
    }
  }

  &-sign {
    text-overflow: ellipsis;
    overflow: hidden;
    color: var.$dark;
  }

  &-duration {
    margin-left: auto;
    color: var.$dark;
    white-space: nowrap;
    font-size: 0.875rem;
    transition: all 0.1s var.$animation;

    @include var.media('<desktop') {
      margin-right: -0.25rem;
    }
  }

  &-disable {

    @include var.media('<desktop') {
      padding: 0.75rem;
    }

    .icon {
      color: var.$dark;
    }

    &[disabled] {
      opacity: 0.2;
    }
  }
}
</style>