<template>
  <div class="album__info">
    <div class="album__info-head">
      <Button
        size="small"
        isOutlined
        isInverted
        :label="lang('getRandomAlbum')"
        @click="getRandomAlbum()"
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
          :style="{ left: '1rem', top: '100%' }"
        >
          <ul>
            <li @click="getWikiInfo">Wiki</li>
          </ul>
        </Overlay>
      </div>
    </div>
    <Modal
      v-if="isWikiReady && wikiFrameURL"
      :isModalActive="isWikiReady"
      @closeModal="closeWikiModal"
    >
      <WikiFrame :frameURL="wikiFrameURL" />
    </Modal>
  </div>
</template>

<script lang="ts">
import { PropType, computed, defineComponent, ref } from 'vue'
import { CategoryBasic } from '~/types/Category'
import { useLocales } from '~/hooks/useLocales'
import wiki from 'wikipedia'
import usePlayer from '~/hooks/usePlayer'
import Button from './Button.vue'
import Overlay from './Overlay.vue'
import Modal from './Modal.vue'
import WikiFrame from './WikiFrame.vue'
import { detectLocale } from '~/utils'

export default defineComponent({
  name: 'AlbumInfo',
  components: {
    Button,
    Overlay,
    Modal,
    WikiFrame
  },
  props: {
    title: {
      type: String,
      required: true
    },
    artist: {
      type: Object as PropType<CategoryBasic>,
      required: true
    },
    genre: {
      type: Object as PropType<CategoryBasic>,
      required: true
    },
    period: {
      type: Object as PropType<CategoryBasic>,
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
    }
  },
  setup({ artist, title }) {
    const { lang } = useLocales()
    const { playingTrack, store } = usePlayer()
    const isActionsOpens = ref(false)
    const isWikiReady = ref(false)
    const wikiFrameURL = ref<string | null>(null)

    const isPlaying = computed(() => (
      playingTrack.value._id &&
      !playingTrack.value.isOnPause &&
      !playingTrack.value.isOnLoading
    ))

    const isPaused = computed(() => (
      playingTrack.value._id &&
      playingTrack.value.isOnPause
    ))

    const playAlbum = () => {
      if (playingTrack.value._id) {
        store.commit('continuePlay')
      } else {
        store.dispatch('playTrack', store.getters.currentPlaylistTracks[0])
        store.commit('expandPlayer')
      }
    }

    const pauseTrack = () => {
      store.commit('setTrackOnPause')
    }

    const getWikiInfo = async () => {
      const albumLang = detectLocale(title)
      const artistLang = detectLocale(artist.title)
      let locale = 'en'

      if (albumLang === 'ru' || artistLang === 'ru') {
        locale = 'ru'
      }

      wiki.setLang(locale)

      try {
        const page = await wiki.page(title)
        wikiFrameURL.value = page.canonicalurl
      } catch (error) {
        console.error(error)
      } finally {
        isWikiReady.value = true
      }
    }

    const closeWikiModal = () => {
      isWikiReady.value = false
      wikiFrameURL.value = null
    }

    return {
      lang,
      isPlaying,
      isPaused,
      playAlbum,
      pauseTrack,
      isActionsOpens,
      getWikiInfo,
      isWikiReady,
      closeWikiModal,
      wikiFrameURL
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

    &-heading {
      font-weight: 900;
      color: $pale;
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
      color: $pale;
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
