<template>
  <div class="album__hero">
    <component
      :is="PageHeadComponent"
      @getRandomAlbum="getRandomAlbum">
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

interface Props {
  album: UnifiedAlbum
  withSearch?: boolean
}

interface Emits {
  (e: 'getRandomAlbum'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()
const { globalGetters: { localize } } = useGlobalStore()

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

const getRandomAlbum = () => emit('getRandomAlbum')
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
      display: flex;
      flex-direction: column;
    }

    &-head {
      display: flex;
    }

    &-summary {
      color: $paleDP;
      line-height: 1.5;
    }

    &-heading {
      color: $paleDP;
      margin: 0.5rem 0 1.75rem;
      max-width: 850px;
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

    &-actions {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      justify-content: flex-end;
      position: absolute;
      bottom: 0;
      right: 0;
    }
  }
}
</style>
