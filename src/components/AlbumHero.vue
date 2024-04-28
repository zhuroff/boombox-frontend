<template>
  <div class="album__hero">
    <div class="album__hero-cover">
      <slot name="cover"></slot>
    </div>
    <div class="album__hero-info">
      <div class="album__hero-head">
        <SearchBlock
          v-if="withSearch"
          type="search"
          size="medium"
          :placeholder="lang('search.placeholder')"
          :results="results"
          @setInputValue="searchSubmit"
        />
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
                >{{ lang('wiki.navItem') }}</li>
                <li
                  class="overlay__list-item"
                  @click="() => $emit('getRandomAlbum')"
                >{{ lang('getRandomAlbum') }}</li>
                <slot name="navlist"></slot>
              </ul>
            </Overlay>
          </div>
        </div>
      </div>
      <div class="album__hero-heading">
        <RouterLink
          v-if="artist?.title"
          :to="`/artists/${artist._id}`"
          :disabled="!artist._id"
          class="album__hero-category"
        >
          {{ artist.title }}&nbsp;
        </RouterLink>
        <span v-if="artist?.title" class="album__hero-divisor">\&nbsp;</span>
        <strong class="album__hero-title">{{ title }}</strong>&nbsp;
        <span v-if="period?.title" class="album__hero-divisor">\&nbsp;</span>
        <RouterLink
          v-if="period?.title"
          :to="`/periods/${period._id}`"
          :disabled="!period._id"
          class="album__hero-category"
        >
          {{ period.title }}
        </RouterLink>
        <span v-if="genre?._id">,&nbsp; </span>
        <RouterLink
          v-if="genre?._id"
          :to="`/genres/${genre._id}`"
          :disabled="!genre._id"
          class="album__hero-category"
        >{{ genre.title }}</RouterLink><br>
      </div>
      <div
        v-if="totalCounts"
        class="album__hero-total"
      >{{ totalCounts }}</div>
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

<script lang="ts">
import { PropType, computed, defineComponent, ref } from 'vue'
import { BasicEntity, WikiSearchResult } from '~/types/Common'
import { useLocales } from '~/hooks/useLocales'
import { useSearch } from '~/hooks/useSearch'
import { detectWikiLocale } from '~/utils'
import store from '~/store'
import wiki from 'wikipedia'
import CoverArt from '~/components/CoverArt.vue'
import Button from './Button.vue'
import Overlay from './Overlay.vue'
import Modal from './Modal.vue'
import WikiFrame from './WikiFrame.vue'
import SearchBlock from '~/components/SearchBlock.vue'

export default defineComponent({
  name: 'AlbumHero',
  components: {
    CoverArt,
    Button,
    Overlay,
    Modal,
    WikiFrame,
    SearchBlock
  },
  props: {
    id: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    artist: {
      type: Object as PropType<Partial<BasicEntity>>,
      required: false
    },
    genre: {
      type: Object as PropType<Partial<BasicEntity>>,
      required: false
    },
    period: {
      type: Object as PropType<Partial<BasicEntity>>,
      required: false
    },
    totalCounts: {
      type: String,
      required: false
    },
    withSearch: {
      type: Boolean,
      required: false,
      default: true
    },
    withActions: {
      type: Boolean,
      required: false,
      default: true
    }
  },
  setup({ artist, title }) {
    const { lang } = useLocales()
    const { actions, getters } = store
    const { searchSubmit, results } = useSearch()
    const isActionsOpens = ref(false)
    const isWikiLoading = ref(false)
    
    const isWikiReady = ref(false)
    const wikiFrameURL = ref<string | undefined>(undefined)
    const wikiFrameResults = ref<WikiSearchResult[] | undefined>(undefined)

    const isPlaying = computed(() => (
      getters.playingTrack.value?._id &&
      !getters.playingTrack.value.isOnPause &&
      !getters.playingTrack.value.isOnLoading
    ))

    const isPaused = computed(() => (
      getters.playingTrack.value?._id &&
      getters.playingTrack.value.isOnPause
    ))

    const getWikiInfo = async (searchParam: string | number = title) => {
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
      if (!artist?.title) return false
      resetWikiData()
      const albumLang = detectWikiLocale(title)
      const artistLang = detectWikiLocale(artist.title)
      let locale = 'en'

      if (albumLang === 'ru' || artistLang === 'ru') {
        locale = 'ru'
      }

      wiki.setLang(locale)
      isWikiLoading.value = true

      try {
        const { results } = await wiki.search(`${artist.title} - ${title}`)
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
      actions.setSnackbarMessage({
        message: lang('wiki.notFound'),
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

    return {
      lang,
      isPlaying,
      isPaused,
      isActionsOpens,
      searchWikiInfo,
      getWikiInfo,
      isWikiReady,
      closeWikiModal,
      wikiFrameURL,
      isWikiLoading,
      wikiFrameResults,
      searchSubmit,
      results
    }
  }
})
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
      width: $coverWidth;
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
