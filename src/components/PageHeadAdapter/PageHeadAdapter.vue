<template>
  <div class="album__hero">
    <component :is="PageHeadComponent">
      <template #hero>
        <div class="album__hero-heading">
          <strong class="album__hero-title">
            {{ album.title }}
          </strong>
        </div>
      </template>
      <slot name="info"></slot>
    </component>
  </div>
</template>

<script setup lang="ts">
import { h, computed } from 'vue'
import useGlobalStore from '~/store/global'
import AlbumPageHead from './AlbumPageHead.vue'
import CompilationPageHead from './CompilationPageHead.vue'
import EmbeddedPageHead from './EmbeddedPageHead.vue'

const {
  globalGetters: { localize }
} = useGlobalStore()

interface Props {
  album: UnifiedAlbum
  withSearch?: boolean
  // withActions?: boolean
}

const props = defineProps<Props>()

const totalTracksTime = computed(() => {
  if (!('tracks' in props.album)) return ''

  const isAllTracksHaveDuration = !!props.album.tracks.every((track) => (
    Number(track.duration)
  ))

  if (!isAllTracksHaveDuration) return localize('unknownTime')

  const totalDurationInSeconds = props.album.tracks.reduce((acc, next) => (
    acc + (Number(next.duration) || 0)
  ), 0)

  const hours = Math.floor(totalDurationInSeconds / 3600)
  const minutes = Math.floor((totalDurationInSeconds % 3600) / 60)
  const seconds = Math.floor(totalDurationInSeconds % 60)

  const formattedTime = `
    ${hours.toString().padStart(2, '0')}:
    ${minutes.toString().padStart(2, '0')}:
    ${seconds.toString().padStart(2, '0')}
  `.replace(/\s+/g, '')

  return formattedTime
})

const renderAlbumHeadComponent = (album: Album) => {
  return h(AlbumPageHead, { album, length: totalTracksTime.value })
}

const renderCompilationHeadComponent = (album: Compilation) => {
  return h(CompilationPageHead, { album, length: totalTracksTime.value })
}

const PageHeadComponent = computed(() => {
  if ('tracks' in props.album) {
    return 'artist' in props.album
      ? renderAlbumHeadComponent(props.album)
      : renderCompilationHeadComponent(props.album)
  }

  return h(EmbeddedPageHead, { album: props.album })
})
</script>

<style lang="scss">
@import '../../scss/variables.scss';
@import 'include-media';
.album {

  &__hero {
    background-color:  $dark;

    @include media('<laptop') {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vw;
    }

    @include media('>=laptop') {
      position: relative;
      display: flex;
      padding: 25px;
      height: 300px;
    }

    &-cover {
      position: relative;
      z-index: 9000;

      @include media('<laptop') {
        width: 100%;
      }

      @include media('>=laptop') {
        width: $coverWidth;
      }
    }

    &-info {
      padding-left: 25px;
      position: relative;
      z-index: 2000;
      flex: 1 1 0;
    }

    &-head {
      display: flex;
    }

    &-summary {
      color: $paleDP;
      line-height: 1.5;
    }

    .input {
      flex-grow: 1;
    }

    &-heading {
      color: $paleDP;
      margin: 0.5rem 0 1.75rem;
    }

    &-title {
      color: $warning;
      @include serif(2.25rem);
    }

    &-category {
      color: inherit;

      &.--link {
        color: $white;
      }

      &[disabled=true] {
        pointer-events: none;
        cursor: default;
      }
    }

    &-divisor {
      font-size: 3rem;
      font-weight: normal;
      color: $warning;
    }

    &-total {
      color: $paleDP;
      margin-top: auto;
      font-weight: 700;
    }

    &-actions {
      margin-left: 1rem;
      display: flex;
      align-items: center;

      .button {
        transform: rotate(90deg);
      }
    }

    &-nav {
      position: relative;
    }
  }
}
</style>
