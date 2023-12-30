<template>
  <div class="album__info">
    <div class="album__info-head">
      <SearchBlock
        v-if="withSearch"
        type="search"
        size="medium"
        isInverted
        :placeholder="lang('search.placeholder')"
        :results="results"
        @setInputValue="searchSubmit"
      />
    </div>
    <div class="album__info-heading">
      <RouterLink
        :to="`/artists/${artist._id}`"
        class="album__info-category"
      >{{ artist.title }}</RouterLink>&nbsp;
      <span class="album__info-divisor">\</span>&nbsp;
      <strong class="album__info-title">{{ title }}</strong>&nbsp;
      <span class="album__info-divisor">\</span>&nbsp;
      <RouterLink
        :to="`/periods/${period._id}`"
        class="album__info-category"
      >{{ period.title }}</RouterLink>,
      <RouterLink
        :to="`/genres/${genre._id}`"
        class="album__info-category"
      >{{ genre.title }}</RouterLink><br>
    </div>
    <div class="album__info-total">{{ totalCounts }}</div>
    <div class="album__info-actions">
      <Button
        v-if="!isPlaying"
        icon="play"
        :label="lang('playButton')"
        @click="playAlbum"
      />
      <Button
        v-else-if="!isPaused"
        icon="pause"
        :label="lang('pauseButton')"
        @click="pauseTrack"
      />
      <div class="album__info-nav">
        <Button
          icon="ellipsis"
          isText
          @click="isActionsOpens = !isActionsOpens"
        />
        <Overlay
          v-if="isActionsOpens"
          :style="{
            width: '200px',
            left: 0,
            top: '100%'
          }"
          @closeOverlay="isActionsOpens = false"
        >
          <ul class="overlay__list">
            <li
              class="overlay__list-item"
              @click="() => searchWikiInfo()"
            >{{ lang('wiki.navItem') }}</li>
            <li
              class="overlay__list-item"
              @click="getRandomAlbum()"
            >{{ lang('getRandomAlbum') }}</li>
            <li
              class="overlay__list-item"
              @click="openCollectionsModal"
            >{{ lang('collections.add') }}</li>
            <li
              class="overlay__list-item"
              @click="addAlbumToPlaylist"
            >{{ lang('player.addToList') }}</li>
          </ul>
        </Overlay>
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
    <Modal
      v-if="isCollectionLoading || isCollectionFetched"
      :isModalActive="isCollectionLoading"
      @closeModal="closeCollectionModal"
    >
      <GatheringTabs
        v-if="collections"
        :isLoading="isCollectionLoading"
        :results="collections"
        :pagination="collectionsPagination"
        :entityID="id"
        placeholderImage="/img/album.webp"
        entityType="collections"
      />
    </Modal>
  </div>
</template>

<script lang="ts">
import { PropType, computed, defineComponent, ref } from 'vue'
import { BasicEntity, Pagination, WikiSearchResult } from '~/types/Common'
import { Compilation } from '~/types/Compilation'
import { useLocales } from '~/hooks/useLocales'
import { useSearch } from '~/hooks/useSearch'
import { useListPage } from '~/hooks/useListPage'
import { detectLocale } from '~/utils'
import store from '~/store'
import wiki from 'wikipedia'
import Button from './Button.vue'
import Overlay from './Overlay.vue'
import Modal from './Modal.vue'
import WikiFrame from './WikiFrame.vue'
import SearchBlock from '~/components/SearchBlock.vue'
import GatheringTabs from './GatheringTabs.vue'
import { CollectionEntityRes } from '~/types/ReqRes'
import CollectionEntity from '~/classes/CollectionEntity'

export default defineComponent({
  name: 'AlbumHero',
  components: {
    Button,
    Overlay,
    Modal,
    WikiFrame,
    SearchBlock,
    GatheringTabs
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
      type: Object as PropType<BasicEntity>,
      required: true
    },
    genre: {
      type: Object as PropType<BasicEntity>,
      required: true
    },
    period: {
      type: Object as PropType<BasicEntity>,
      required: true
    },
    entityType: {
      type: String,
      required: true
    },
    totalCounts: {
      type: String,
      required: true
    },
    getRandomAlbum: {
      type: Function as PropType<() => void>,
      required: true
    },
    withSearch: {
      type: Boolean,
      required: false,
      default: true
    }
  },
  setup({ id, artist, title }) {
    const { lang } = useLocales()
    const { actions, getters } = store
    const { searchSubmit, results } = useSearch()
    const { fetchData, isDataFetched, pagePagination } = useListPage<CollectionEntityRes<string>, CollectionEntity<string>>(CollectionEntity)
    const collections = ref<CollectionEntity<string>[] | undefined>([])
    const isActionsOpens = ref(false)
    const isWikiLoading = ref(false)
    const isCollectionLoading = ref(false)
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

    const playAlbum = () => {
      if (getters.playlists.value.current._id === id) {
        if (getters.playingTrack.value) {
          actions.continuePlay()
          return
        }
      }

      const actualPlaylist = getters.playlists.value.current._id === id
        ? getters.playlists.value.current
        : getters.playlists.value.reserved
      
      const trackToPlay = actualPlaylist?.tracks.find(({ isDisabled }) => !isDisabled)

      if (trackToPlay) {
        actions.playTrack(trackToPlay)
        actions.togglePlayerVisibility()
      }
    }

    const pauseTrack = () => {
      actions.setTrackOnPause()
    }

    const getWikiInfo = async (searchParam: string | number = title) => {
      isWikiLoading.value = true
      try {
        const page = await wiki.page(String(searchParam))
        wikiFrameURL.value = page.canonicalurl
        isWikiReady.value = true
        isWikiLoading.value = false
      } catch (error) {
        wikiErrorHandler(error)
      }
    }

    const searchWikiInfo = async () => {
      resetWikiData()
      const albumLang = detectLocale(title)
      const artistLang = detectLocale(artist.title)
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

    const closeCollectionModal = () => {
      isCollectionLoading.value = false
      isDataFetched.value = false
    }

    const resetWikiData = () => {
      wikiFrameURL.value = undefined
      wikiFrameResults.value = undefined
    }

    const openCollectionsModal = async () => {
      isCollectionLoading.value = true
      isActionsOpens.value = false
      collections.value = await fetchData('collections')
      isCollectionLoading.value = false
    }

    const addAlbumToPlaylist = () => {
      actions.addAlbumToPlaylist()
      isActionsOpens.value = false
    }

    return {
      lang,
      isPlaying,
      isPaused,
      playAlbum,
      pauseTrack,
      isActionsOpens,
      searchWikiInfo,
      getWikiInfo,
      isWikiReady,
      closeWikiModal,
      wikiFrameURL,
      isWikiLoading,
      wikiFrameResults,
      openCollectionsModal,
      addAlbumToPlaylist,
      searchSubmit,
      results,
      collections,
      isCollectionLoading,
      closeCollectionModal,
      isCollectionFetched: isDataFetched,
      collectionsPagination: pagePagination
    }
  }
})
</script>

<style lang="scss" scoped>
@import '../scss/variables.scss';
@import 'include-media';

.album {

  &__info {
    padding-left: 25px;
    display: flex;
    flex-direction: column;

    &-head {
      display: flex;
    }

    .input {
      flex-grow: 1;
    }

    &-heading {
      font-weight: 900;
      color: $paleDP;
      margin: 0.5rem 0 0.5rem;
    }

    &-title {
      color: $warning;
      @include serif(2.25rem, bold);
    }

    &-category {
      font-size: 1.25rem;
      color: inherit;
      transition: color .2s $animation;

      &:hover {
        color: $white;
        transition: color .2s $animation;
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
      font-weight: 600;
    }

    &-actions {
      margin-top: 3rem;
      display: flex;
      align-items: center;
    }

    &-nav {
      position: relative;
    }
  }
}
</style>
~/classes/CollectionEntity