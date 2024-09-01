<template>  
  <div class="lyrics">
    <header class="lyrics__header">
      <div class="lyrics__heading">{{ heading.replace('Various Artists - ', '') }}</div>
      <Button
        :label="localize('lyrics.get')"
        :disabled="isFetching"
        isInverted
        @click="fetchLyrics"
      />
    </header>
    <div class="lyrics__content">
      <transition name="fade">
        <Preloader
          v-if="isFetching"
          mode="light"
        />
      </transition>
      <transition
        name="flyUp"
        v-if="!isFetching"
      >
        <div
          v-if="!lyrics && !fetchedLyrics.length"
          class="lyrics__empty"
        >{{ localize('lyrics.empty') }}</div>
      </transition>
      <TextareaInput
        v-if="!isFetching && !fetchedLyrics.length"
        className="lyrics__text"
        name="lyrics"
        type="textarea"
        :defaultValue="lyrics || undefined"
        :placeholder="localize('lyrics.placeholder')"
        @setTextareaValue="updateLyrics"
      />
      <div
        v-if="!isFetching"
        class="lyrics__results"
      >
        <ul
          v-if="fetchedLyrics.length"
          class="lyrics__list"
        >
          <li
            v-for="(item, index) in fetchedLyrics"
            :key="index"
            class="lyrics__item"
          >
            <img
              :src="item.thumbnail"
              class="lyrics__item_thumbnail"
            />
            <div class="lyrics__item_content">
              <div class="lyrics__item_title">{{ item.artist }} - {{ item.title }}</div>
              <button
                class="lyrics__item_action"
                @click="expandLyrics(index)"
              >
                <span v-if="expandedLyrics === null || expandedLyrics !== index">{{ localize('lyrics.expand') }}</span>
                <span v-if="expandedLyrics !== null && expandedLyrics === index">{{ localize('lyrics.collapse') }}</span>
              </button>
              <span v-if="!track.isTOY">&nbsp;/&nbsp;</span>
              <button
                v-if="!track.isTOY"
                class="lyrics__item_action"
                @click="saveLyrics(item.lyrics)"
              >{{ localize('lyrics.save') }}</button>
              <TextareaInput
                v-if="expandedLyrics === index"
                :defaultValue="item.lyrics"
                name="lyrics"
                type="textarea"
                className="lyrics__text"
                disabled
              />
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import useGlobalStore from '~/store/global'
import useSnackbar from '~/hooks/useSnackbar'
import { TrackLyricsResponse } from '~/types/Track'
import Button from '~/components/Button.vue'
import TextareaInput from '~/components/Form/TextareaInput.vue'
import Preloader from '~/components/Preloader.vue'
import trackServices from '~/services/track.services'
import AlbumTrack from '~/classes/AlbumTrack'

interface Props {
  heading: string
  track: AlbumTrack
}

const props = defineProps<Props>()

const {
  globalGetters: { localize }
} = useGlobalStore()

const { setSnackbarMessage } = useSnackbar()

const lyrics = ref<null | string>(null)
const expandedLyrics = ref<null | number>(null)
const isFetching = ref(false)
const fetchedLyrics = reactive<TrackLyricsResponse[]>([])
const updateLyricsTimer = ref<ReturnType<typeof setTimeout> | number>(0)

const updateLyrics = (value?: string) => {
  lyrics.value = value || ''

  if (typeof updateLyricsTimer.value === 'number') {
    clearTimeout(updateLyricsTimer.value)
    updateLyricsTimer.value = setTimeout(() => (
      saveLyrics(value || '', false)
    ), 1000)
  }
}

const setFoundLyrics = (data: TrackLyricsResponse[]) => {
  isFetching.value = false
  fetchedLyrics.push(...data)
}

const setNotFoundLyricsError = (error: { message: string }) => {
  isFetching.value = false

  setSnackbarMessage({
    message: error.message,
    type: 'error'
  })
}

const fetchLyrics = () => {
  isFetching.value = true

  trackServices.searchLyrics(props.heading.replace('Various Artists', ''))
    .then((result) => setFoundLyrics(result))
    .catch((error) => setNotFoundLyricsError(error))
}

const expandLyrics = (index: number) => {
  expandedLyrics.value =
    index === expandedLyrics.value
      ? null
      : index
}

const saveLyrics = (payload: string, isConfirm = true) => {
  lyrics.value = payload
  fetchedLyrics.length = 0

  trackServices.saveLyrics(props.track._id, payload)
    .then((message) => {
      if (isConfirm) {
        setSnackbarMessage({
          message: String(message),
          type: 'success'
        })
      }
    })
    .catch((error) => console.dir(error))
}

const fetchTrackLyrics = async () => {
  trackServices.fetchLyrics(props.track._id)
    .then((data) => lyrics.value = data)
    .catch((error) => console.dir(error))
}

onMounted(() => {
  !props.track.isTOY && fetchTrackLyrics()
})
</script>

<style lang="scss">
@import '~/scss/variables';

.lyrics {
  background-color: $white;
  border-radius: 10px;
  width: 100%;
  max-width: 768px;
  height: calc(100vh - 50px);
  overflow: hidden;
  display: flex;
  flex-direction: column;

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: $dark;
    padding: 25px;
    position: relative;
    z-index: 10;
  }

  &__heading {
    font-weight: 600;
    font-size: 20px;
    color: $white;
  }

  &__content {
    padding: 25px;
    position: relative;
    flex-grow: 1;
    max-height: 100%;
    overflow: auto;

    .preloader {
      position: absolute;
      background: $white;
      z-index: 100;
      width: 100%;
      height: 100%;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
    }
  }

  &__text {
    outline: none;
    line-height: 22px;
    margin-top: 1rem;
    padding: 0 !important;
    border: none !important;
    background-color: $white;
  }

  &__empty {
    text-align: center;
    padding: 0 25px;
    font-size: 20px;
    overflow: hidden;

    & + .lyrics__text {
      margin-top: 25px;
    }
  }

  &__item {
    margin-bottom: 10px;
    display: flex;
    position: relative;

    &_thumbnail {
      width: 50px;
      height: 50px;
      flex: none;
      border-radius: 5px;
      object-fit: cover;
    }

    &_content {
      flex: 1 1 0;
      margin-left: 10px;
    }

    &_title {
      color: $dark;
      font-weight: 600;
      font-size: 18px;
    }

    &_action {
      padding: 5px 0;
      background-color: transparent;
      outline: none;
      border: 0;
      color: $paleDP;
    }
  }
}
</style>
