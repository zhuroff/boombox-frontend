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
      v-if="!fetchedLyrics.isFetched"
    >
      <div
        v-if="!lyricsContent"
        class="lyrics__empty"
      >No lyrics here yet</div>
    </transition>

    <Textarea
      v-if="!isFetching && !fetchedLyrics.data.length"
      :rows="3"
      :content="lyricsContent"
      classname="lyrics__text"
      placeholder="You can add lyrics manually in this field, or use the search button above."
      @setTextareaValue="setLyrics"
    />

    <div
      v-if="fetchedLyrics.isFetched"
      class="lyrics__results"
    >
      <ul
        v-if="fetchedLyrics.data.length"
        class="lyrics__list"
      >
        <li
          v-for="(item, index) in fetchedLyrics.data"
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

      <div
        v-else
        class="lyrics__empty"
      >Nothing was found</div>
    </div>
  </div>
</div>

</template>

<script lang="ts">

import { defineComponent, Ref, ref, reactive, onMounted } from 'vue'
import { useStore } from 'vuex'
import { key } from '~/store'
import Button from '~/components/Button/Button.vue'
import SimpleBar from 'simplebar'
import Textarea from '~/components/Inputs/Textarea.vue'
import Preloader from '~/components/Preloader/Preloader.vue'
import api from '~/api'

export default defineComponent({
  components: {
    Button,
    Textarea,
    Preloader
  },

  props: {
    lyrics: {
      type: String,
      required: false
    },

    heading: {
      type: String,
      required: true
    }
  },

  setup(props, { emit }) {
    const store = useStore(key)

    const lyricsContent = ref(props.lyrics)
    const expandedLyrics: Ref<null | number> = ref(null)
    const scrollspace = ref(null as any)
    const isFetching = ref(false)
    const fetchErrorMessage = ref(null)

    onMounted(() => {
      const scrollElement = document.querySelector('.lyrics__content') as HTMLElement

      if (scrollElement) {
        scrollspace.value = new SimpleBar(scrollElement, { autoHide: false })
      }
    })

    const fetchedLyrics = reactive({
      isFetched: false,
      data: []
    })

    const fetchLyrics = async () => {
      isFetching.value = true

      try {
        const response = await api.post('/api/tracks/lyrics', { query: props.heading })

        isFetching.value = false
        
        if (response) {
          fetchedLyrics.data = response.data
          fetchedLyrics.isFetched = true
        } else {
          store.commit('setSnackbarMessage', {
            message: 'Unknown error',
            type: 'error'
          })
        }
      } catch (error) {
        console.log(error)
        isFetching.value = false
        throw error
      }
    }

    const setLyrics = (value: string) => {
      lyricsContent.value = value
    }

    const expandLyrics = (index: number) => {
      expandedLyrics.value = index === expandedLyrics.value
        ? null
        : index
    }

    const saveLyrics = (lyrics: string) => {
      lyricsContent.value = lyrics
      fetchedLyrics.isFetched = false
      fetchedLyrics.data = []

      emit('saveLyrics', lyrics)
    }

    const closeSnackbar = () => {
      fetchErrorMessage.value = null
    }

    return {
      lyricsContent,
      expandedLyrics,
      isFetching,
      fetchLyrics,
      fetchedLyrics,
      setLyrics,
      expandLyrics,
      saveLyrics,
      fetchErrorMessage,
      closeSnackbar
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
