<template>
  
<div class="lyrics">
  <header class="lyrics__header">
    <div class="lyrics__heading">{{ heading }}</div>

    <Button
      text="Get lyrics"
      isOutlined
      @onClick="fetchLyrics"
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
      >No lyrics here yet</div>
    </transition>

    <Textarea
      v-if="!isFetching && !fetchedLyrics.length"
      :rows="3"
      :content="lyrics"
      classname="lyrics__text"
      placeholder="You can add lyrics manually in this field, or use the search button above."
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
              <span v-if="!expandedLyrics || expandedLyrics !== index">Expand content</span>
              <span v-if="expandedLyrics && expandedLyrics === index">Collapse content</span>
            </button>&nbsp;/&nbsp;

            <button
              class="lyrics__item_action"
              @click="saveLyrics(item.lyrics)"
            >Save lyrics</button>

            <Textarea
              v-if="expandedLyrics === index"
              :rows="3"
              :content="item.lyrics"
              classname="lyrics__item_text"
              isDisabled
            />
          </div>
        </li>
      </ul>
    </div>
  </div>
</div>

</template>

<script lang="ts">

import { defineComponent, Ref, ref, reactive, onMounted } from 'vue'
import { useStore } from 'vuex'
import { key } from '~/store'
import { TrackLyricsResponse } from '~/types/Track'
import Button from '~/components/Button/Button.vue'
import SimpleBar from 'simplebar'
import Textarea from '~/components/Inputs/Textarea.vue'
import Preloader from '~/components/Preloader/Preloader.vue'
import TrackServices from '~/services/TrackServices'

export default defineComponent({
  components: {
    Button,
    Textarea,
    Preloader
  },

  props: {
    heading: {
      type: String,
      required: true
    },

    id: {
      type: String,
      required: true
    }
  },

  setup(props) {
    const store = useStore(key)

    const lyrics: Ref<null | string> = ref(null)
    const expandedLyrics: Ref<null | number> = ref(null)
    const scrollspace = ref(null as any)
    const isFetching = ref(false)
    const fetchedLyrics = reactive<TrackLyricsResponse[]>([])

    const updateLyrics = (value: string) => {
      lyrics.value = value
    }

    const setFoundLyrics = (data: TrackLyricsResponse[]) => {
      isFetching.value = false
      fetchedLyrics.push(...data)
    }

    const setNotFoundLyricsError = (error: { message: string }) => {
      isFetching.value = false

      store.commit('setSnackbarMessage', {
        message: error.message,
        type: 'error'
      })
    }

    const fetchLyrics = () => {
      isFetching.value = true

      TrackServices.searchLyrics(props.heading)
        .then((result) => setFoundLyrics(result))
        .catch((error) => setNotFoundLyricsError(error))
    }

    const expandLyrics = (index: number) => {
      expandedLyrics.value =
        index === expandedLyrics.value
          ? null
          : index
    }

    const saveLyrics = (payload: string) => {
      lyrics.value = payload
      fetchedLyrics.length = 0

      TrackServices.saveLyrics(props.id, payload)
        .then((message) => {
          store.commit('setSnackbarMessage', {
            message,
            type: 'success'
          })
        })
        .catch((error) => console.dir(error))
    }

    const fetchTrackLyrics = async (id: string) => {
      TrackServices.fetchLyrics(id)
        .then((data) => lyrics.value = data)
        .catch((error) => console.dir(error))
    }

    onMounted(() => {
      fetchTrackLyrics(props.id)

      const scrollElement = document.querySelector('.lyrics__content') as HTMLElement

      if (scrollElement) {
        scrollspace.value = new SimpleBar(scrollElement, { autoHide: false })
      }
    })

    return {
      lyrics,
      expandedLyrics,
      isFetching,
      fetchLyrics,
      fetchedLyrics,
      updateLyrics,
      expandLyrics,
      saveLyrics
    }
  }
})

</script>

<style lang="scss" scoped>

@import '~/scss/variables';

.lyrics {
  background-color: $white;
  border-radius: 10px;
  width: 100%;
  max-width: 768px;
  height: calc(100vh - 50px);
  overflow: hidden;

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
    height: calc(100% - 75px);

    .preloader {
      position: absolute;
      background: $white;
      z-index: 100;
      width: 100%;
      top: 0;
      bottom: 0;
      left: 0;
    }
  }

  &__text {
    border: 0;
    outline: none;
    width: 100%;
    font-size: 16px;
    line-height: 22px;
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
      color: $pale;
    }

    &_text {
      padding: 0;
      border: none;
      width: 100%;
      font-size: 14px;
      line-height: 20px;
      background-color: $white;
    }
  }
}

</style>
