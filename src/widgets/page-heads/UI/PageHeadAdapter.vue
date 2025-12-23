<template>
  <div class="album__hero">
    <component
      :is="PageHeadComponent"
      @getRandomAlbum="getRandomAlbum"
      @callSearchBlock="isSearchMode = true"
      @addToCollection="addToCollection"
      @getWikiInfo="getWikiInfo"
      @deleteAlbum="deleteAlbum"
    >
      <template #heading>
        <h1 class="album__hero-heading">
          <div
            ref="headingRef"
            :contenteditable="isEditable && isEditMode"
            @input="setNewTitle"
          >{{ album.title }}</div>

          <Button
            v-if="isEditable && !isEditMode"
            icon="pencil"
            isInverted
            isRounded
            @click="activateEditMode"
          />

          <Button
            v-if="isEditable && isEditMode"
            icon="save"
            isInverted
            isRounded
            @click="saveNewTitle"
          />
        </h1>
      </template>
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
import { h, computed, ref, nextTick } from 'vue'
import { useSearch, SearchService, SearchModal } from '~features/search'

import { Modal, Button } from '~shared/UI'
import { useLocalization } from '~shared/model'
import { assertNever } from '~shared/utils'

import AlbumPageHead from './AlbumPageHead.vue'
import CompilationPageHead from './CompilationPageHead.vue'
import EmbeddedPageHead from './EmbeddedPageHead.vue'
import TOYPageHead from './TOYPageHead.vue'

import type { UnifiedEntityFullCard } from '~widgets/entity-cards'

interface Props {
  album: UnifiedEntityFullCard
  withSearch?: boolean
  isEditable?: boolean
}

interface Emits {
  (e: 'getRandomAlbum'): void
  (e: 'addToCollection'): void
  (e: 'getWikiInfo'): void
  (e: 'deleteAlbum'): void
  (e: 'saveNewTitle'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const { localize } = useLocalization()

const searchService = new SearchService()

const searchQuery = ref('')
const isSearchMode = ref(false)
const isEditMode = ref(false)
const newTitle = ref(props.album.title)
const headingRef = ref<HTMLDivElement>()

const { searchResults, isSearchFetching } = useSearch(searchQuery, searchService)

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

const PageHeadComponent = computed(() => {
  switch (props.album.kind) {
    case 'album':
      return (
        'metadataContent' in props.album
          ? h(TOYPageHead, { album: props.album, length: '' })
          : h(AlbumPageHead, { album: props.album, length: totalTracksTime.value })
      )
    case 'embedded':
      return h(EmbeddedPageHead, { album: props.album })
    case 'compilation':
    case 'collection':
      return h(CompilationPageHead, { album: props.album, length: totalTracksTime.value })
    default:
      return assertNever(props.album)
  }
})

const getRandomAlbum = () => emit('getRandomAlbum')
const addToCollection = () => emit('addToCollection')
const getWikiInfo = () => emit('getWikiInfo')
const deleteAlbum = () => emit('deleteAlbum')

const setNewTitle = (e: Event) => {
  const target = e.target as HTMLDivElement
  newTitle.value = target.innerText
}

const saveNewTitle = () => {
  isEditMode.value = false
}

const activateEditMode = () => {
  isEditMode.value = true
  nextTick(() => {
    headingRef.value?.focus()
  })
}
</script>

<style lang="scss">
@use '~/app/styles/variables' as var;

.album {

  &__hero {

    @include var.media('<desktop') {
      display: flex;
      flex-direction: column;
      background-color: transparent;
    }

    @include var.media('>=desktop') {
      background-color: var.$dark;
      position: relative;
      display: flex;
      padding: var.$mainPadding;
      height: 300px;
    }

    &-cover {
      position: relative;
      z-index: 9000;

      @include var.media('<desktop') {
        width: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
      }

      @include var.media('>=desktop') {
        width: var.$coverWidth;
      }
    }

    &-info {
      flex: 1 1 0;
      display: flex;
      flex-direction: column;

      @include var.media('<desktop') {
        padding: var.$mainPadding var.$minPadding 0;
        text-align: center;
      }

      @include var.media('>=desktop') {
        position: relative;
        z-index: 2000;
        padding-left: var.$mainPadding;
      }
    }

    &-heading {
      margin: 0.5rem 0 1.75rem;
      max-width: 850px;
      color: var.$warning;

      @include var.media('<desktop-md') {
        @include var.serif(1.75rem);
      }

      @include var.media('>=desktop-md') {
        @include var.serif(2.25rem);
      }

      .button {
        opacity: 0;
      }

      &:hover {
        .button {
          opacity: 1;
        }
      }
    }
  }
}
</style>
