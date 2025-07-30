<template>  
  <div class="lyrics">
    <header class="lyrics__header">
      <div class="lyrics__heading">
        {{ heading.replace('Various Artists - ', '') }}
      </div>

      <Button
        :label="localize('lyrics.get')"
        :disabled="isFetching"
        isInverted
        @click="fetchLyrics"
      />
    </header>

    <div class="lyrics__content">
      <transition name="fade">
        <Loader
          v-if="isFetching"
          mode="light"
        />
      </transition>

      <transition
        name="flyUp"
        v-if="!isFetching"
      >
        <div
          v-if="!lyricsLocal && !fetchedLyrics.length"
          class="lyrics__empty"
        >{{ localize('lyrics.empty') }}</div>
      </transition>

      <TextareaInput
        v-if="!isFetching && !fetchedLyrics.length"
        className="lyrics__text"
        name="lyrics"
        type="textarea"
        :modelValue="lyricsLocal || ''"
        :placeholder="localize('lyrics.placeholder')"
        @onInput="updateLyrics"
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
              <div class="lyrics__item_title">
                {{ item.artist }} - {{ item.title }}
              </div>

              <button
                class="lyrics__item_action"
                @click="expandLyrics(index)"
              >
                <span v-if="expandedLyrics === null || expandedLyrics !== index">
                  {{ localize('lyrics.expand') }}
                </span>

                <span v-if="expandedLyrics !== null && expandedLyrics === index">
                  {{ localize('lyrics.collapse') }}
                </span>
              </button>

              <!-- <span v-if="!track.isTOY">&nbsp;/&nbsp;</span>
              <button
                v-if="!track.isTOY"
                class="lyrics__item_action"
                @click="saveLyrics(item.lyrics)"
              >{{ localize('lyrics.save') }}</button> -->
              <TextareaInput
                v-if="expandedLyrics === index"
                :modelValue="item.lyrics"
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
import { ref, reactive, watch } from 'vue'
import { useTrack } from '~entities/track'
import { useSnackbar, useLocalization } from '~shared/model'
import { Loader, Button, TextareaInput } from '~shared/UI'
import { DatabaseService } from '~shared/api'
import { debounce } from '~shared/utils'
import type { TrackBasic, ExternalTrackLyricsResponse } from '~entities/track'

interface Props {
  heading: string
  track: TrackBasic
}

const props = defineProps<Props>()

const { localize } = useLocalization()

const { setSnackbarMessage } = useSnackbar()

const dbService = new DatabaseService()

const lyricsLocal = ref<null | string>(null)
const expandedLyrics = ref<null | number>(null)
const isFetching = ref(false)
const fetchedLyrics = reactive<ExternalTrackLyricsResponse[]>([])

const { lyricsRes, saveLyrics } = useTrack(props.track._id, dbService)

const updateLyrics = debounce((value?: string) => {
  saveLyrics(value || '')
}, 1000)

const setFoundLyrics = (data: ExternalTrackLyricsResponse[]) => {
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

  // trackServices.searchLyrics(props.heading.replace('Various Artists', ''))
  //   .then((result) => setFoundLyrics(result))
  //   .catch((error) => setNotFoundLyricsError(error))
}

const expandLyrics = (index: number) => {
  expandedLyrics.value =
    index === expandedLyrics.value
      ? null
      : index
}

// const fetchTrackLyrics = async () => {
//   // trackServices.fetchLyrics(props.track._id)
//   //   .then((data) => lyrics.value = data)
//   //   .catch((error) => console.dir(error))
// }
watch(
  lyricsRes,
  (newValue) => {
    lyricsLocal.value = newValue?.lyrics || ''
  }
)
</script>

<style lang="scss">
@use '~/app/styles/variables' as var;

.lyrics {
  background-color: var.$paleLT;
  border-radius: var.$basicPadding;
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
    background-color: var.$dark;
    padding: 25px;
    position: relative;
    z-index: 10;
  }

  &__heading {
    font-weight: 600;
    font-size: 20px;
    color: var.$white;
  }

  &__content {
    padding: 25px;
    position: relative;
    flex-grow: 1;
    max-height: 100%;
    overflow: auto;

    .loader {
      position: absolute;
      background: var.$white;
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
    background-color: var.$paleLT;
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
    margin-bottom: var.$basicPadding;
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
      margin-left: var.$basicPadding;
    }

    &_title {
      color: var.$dark;
      font-weight: 600;
      font-size: 18px;
    }

    &_action {
      padding: 5px 0;
      background-color: transparent;
      outline: none;
      border: 0;
      color: var.$paleDP;
    }
  }
}
</style>
