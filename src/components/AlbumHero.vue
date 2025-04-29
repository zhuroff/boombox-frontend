<template>
  <div class="album__hero">
    <div class="album__hero-info">
      <div class="album__hero-head">
        <div
          v-if="withActions"
          class="album__hero-actions"
        >
          <div class="album__hero-nav">
            <Button
              icon="ellipsis"
              isText
              isInverted
              @click="isActionsOpens = !isActionsOpens"
            />
            <Overlay
              v-if="isActionsOpens"
              :style="{
                width: '200px',
                right: 0,
                top: '100%'
              }"
              @closeOverlay="isActionsOpens = false"
            >
              <ul
                class="overlay__list"
                @click="isActionsOpens = false"
              >
                <li
                  class="overlay__list-item"
                  @click="searchWikiInfo"
                >{{ localize('wiki.navItem') }}</li>
                <li
                  class="overlay__list-item"
                  @click="() => $emit('getRandomAlbum')"
                >{{ localize('getRandomAlbum') }}</li>
                <slot name="navlist"></slot>
              </ul>
            </Overlay>
          </div>
        </div>
      </div>
    </div>
    <Modal
      v-if="isWikiLoading || isWikiReady"
      :isModalActive="isWikiLoading"
      @closeModal="closeWikiModal"
    >
      <WikiFrame
        :frameURL="wikiFrameURL"
        :isLoading="isWikiLoading"
        :searchResults="wikiFrameResults"
        @selectWikiResult="(wikiID) => getWikiInfo(wikiID)"
      />
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { BasicEntity, WikiSearchResult } from '~/types/Common'
import useGlobalStore from '~/store/global'
import useSnackbar from '~/hooks/useSnackbar'
// import { useSearch } from '~/hooks/useSearch'
import { detectWikiLocale } from '~/utils'
import wiki from 'wikipedia'
import Button from './Button.vue'
import Overlay from './Overlay.vue'
import Modal from './Modal.vue'
import WikiFrame from './WikiFrame.vue'
import SearchBlock from '~/components/SearchBlock.vue'
import usePlaylist from '~/store/playlist'

interface Props {
  album: UnifiedAlbum
  frame?: string
  totalCounts?: string
  withSearch?: boolean
  withActions?: boolean
}

const props = defineProps<Props>()

const { globalGetters: { localize } } = useGlobalStore()
const { playerGetters: { playingTrack } } = usePlaylist()
const { setSnackbarMessage } = useSnackbar()
// const { searchSubmit, results } = useSearch()
const isActionsOpens = ref(false)
const isWikiLoading = ref(false)

const isWikiReady = ref(false)
const wikiFrameURL = ref<string | undefined>(undefined)
const wikiFrameResults = ref<WikiSearchResult[] | undefined>(undefined)

// const isPlaying = computed(() => (
//   playingTrack.value?._id 
//   && !playingTrack.value.isOnPause
//   && !playingTrack.value.isOnLoading
// ))

// const isPaused = computed(() => (
//   playingTrack.value?._id
//   && playingTrack.value.isOnPause
// ))

const getWikiInfo = async (searchParam: string | number = props.album.title) => {
  isWikiLoading.value = true
  try {
    const wikiPage = await wiki.page(String(searchParam))
    wikiFrameURL.value = wikiPage.canonicalurl
    isWikiReady.value = true
    isWikiLoading.value = false
  } catch (error) {
    wikiErrorHandler(error)
  }
}

const searchWikiInfo = async () => {
  if (!props.album.artist?.title) return false
  resetWikiData()
  const albumLang = detectWikiLocale(props.album.title)
  const artistLang = detectWikiLocale(props.album.artist.title)
  let locale = 'en'

  if (albumLang === 'ru' || artistLang === 'ru') {
    locale = 'ru'
  }

  wiki.setLang(locale)
  isWikiLoading.value = true

  try {
    const { results } = await wiki.search(`${props.album.artist.title} - ${props.album.title}`)
    if (!results.length) {
      throw new Error('Nothing was found')
    }
    wikiFrameResults.value = results
    isWikiReady.value = true
  } catch (error) {
    wikiErrorHandler(error)
  } finally {
    isWikiLoading.value = false
  }
}

const wikiErrorHandler = (error: unknown) => {
  closeWikiModal()
  setSnackbarMessage({
    message: localize('wiki.notFound'),
    type: 'error'
  })
  console.error(error)
}

const closeWikiModal = () => {
  isWikiReady.value = false
  isWikiLoading.value = false
  resetWikiData()
}

const resetWikiData = () => {
  wikiFrameURL.value = undefined
  wikiFrameResults.value = undefined
}
</script>

<style lang="scss" scoped>
@import '../scss/variables.scss';
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

    .input {
      flex-grow: 1;
    }

    &-heading {
      color: $paleDP;
      margin: 0.5rem 0 0.5rem;
    }

    &-title {
      color: $warning;
      @include serif(2.25rem);
    }

    &-category {
      font-size: 1.25rem;
      font-weight: 700;
      color: inherit;
      transition: color .2s $animation;

      &:hover {
        color: $white;
        transition: color .2s $animation;
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
      // margin-left: 1rem;
      display: flex;
      align-items: center;

      // .button {
      //   transform: rotate(90deg);
      // }
    }

    &-nav {
      position: relative;
    }
  }
}
</style>
