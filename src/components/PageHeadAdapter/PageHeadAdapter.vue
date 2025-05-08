<template>
  <div class="album__hero">
    <component
      :is="PageHeadComponent"
      @getRandomAlbum="getRandomAlbum"
      @callSearchBlock="isSearchMode = true"
      @addToCollection="addToCollection"
      @getWikiInfo="getWikiInfo"
    >
      <template #hero>
        <div class="album__hero-heading">
          <strong class="album__hero-title">
            {{ album.title }}
          </strong>
        </div>
      </template>
      <slot name="info"></slot>
    </component>
    <Modal
      :isModalActive="isSearchMode"
      @closeModal="isSearchMode = false"
    >
      <SearchModal
        :isFetching="isSearchFetching"
        :results="searchResults"
        @onSearch="onSearch"
      ></SearchModal>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { h, computed, ref } from 'vue'
import DatabaseService from '~/shared/api/DatabaseService'
import useSearch from '~/shared/useSearch'
import useGlobalStore from '~/store/global'
import AlbumPageHead from './AlbumPageHead.vue'
import CompilationPageHead from './CompilationPageHead.vue'
import EmbeddedPageHead from './EmbeddedPageHead.vue'
import { Modal } from '~shared/UI'
import SearchModal from '~/components/Search/SearchModal.vue'

interface Props {
  album: UnifiedAlbum
  withSearch?: boolean
}

interface Emits {
  (e: 'getRandomAlbum'): void
  (e: 'addToCollection'): void
  (e: 'getWikiInfo'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const { globalGetters: { localize } } = useGlobalStore()

const dbService = new DatabaseService()

const searchQuery = ref('')
const isSearchMode = ref(false)

const { searchResults, isSearchFetching } = useSearch(searchQuery, dbService)

const onSearch = (value: string) => {
  searchQuery.value = value
}

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
const addToCollection = () => emit('addToCollection')
const getWikiInfo = () => emit('getWikiInfo')
</script>

<style lang="scss">
@use '~/scss/variables' as var;

.album {
  &__hero {
    background-color: var.$dark;

    @include var.media('<laptop') {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vw;
    }

    @include var.media('>=laptop') {
      position: relative;
      display: flex;
      padding: 25px;
      height: 300px;
    }

    &-cover {
      position: relative;
      z-index: 9000;

      @include var.media('<laptop') {
        width: 100%;
      }

      @include var.media('>=laptop') {
        width: var.$coverWidth;
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
      color: var.$paleDP;
      line-height: 1.5;
    }

    &-heading {
      color: var.$paleDP;
      margin: 0.5rem 0 1.75rem;
      max-width: 850px;
    }

    &-title {
      color: var.$warning;
      @include var.serif(2.25rem);
    }

    &-category {
      color: inherit;

      &.--link {
        color: var.$white;
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
