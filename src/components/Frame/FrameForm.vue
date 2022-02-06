<template>
  <form
    class="form-frame"
    @submit.prevent="saveNewFrame"
  >
    <div class="form-frame__row">
      <InputText
        type="text"
        placeholder="Frame album title"
        @setInputValue="setFrameTitle"
      />
    </div>

    <div class="form-frame__row">
      <Textarea
        placeholder="Frame album code"
        :rows="5"
        @setTextareaValue="setFrameCode"
      />
    </div>

    <div class="form-frame__row">
      <Button
        :text="newFrame.artist.title"
        isFullWidth
        @onClick="openCloseCategoryList('artists')"
      />
    </div>

    <div class="form-frame__row">
      <Button
        :text="newFrame.genre.title"
        isFullWidth
        @onClick="openCloseCategoryList('genres')"
      />
    </div>

    <div class="form-frame__row">
      <Button
        :text="newFrame.period.title"
        isFullWidth
        @onClick="openCloseCategoryList('periods')"
      />
    </div>

    <div class="form-frame__row">
      <Button
        text="Save"
        type="submit"
      />
    </div>

    <div
      v-if="categoryState.isActive"
      class="form-frame__categories"
    >
      <div class="form-frame__heading">{{ categoryState.key }}</div>
      <button
        class="form-frame__close"
        @click="openCloseCategoryList('')"
      >
        <AppSprite name="delete" />
      </button>

      <div class="form-frame__row">
        <InputText
          type="text"
          placeholder="Search..."
          @setInputValue="searchByQuery"
        />
      </div>

      <ul
        v-if="categoryState.results.length"
        class="form-frame__results"
      >
        <li
          v-for="item in categoryState.results"
          :key="item._id"
          class="form-frame__result"
        >
          {{ item.title }}
        </li>
      </ul>
    </div>
  </form>

  <!-- <div
                v-if="isCategoryListActive"
                class="frames__categories"
              >

                <div
                  v-if="searchResults"
                  class="frames__categories-results"
                >
                  <ul
                    v-if="searchResults.length"
                    class="frames__categories-list"
                  >
                    <li
                      v-for="item in searchResults"
                      :key="item._id"
                      class="frames__categories-item"
                    >
                      <label>
                        <input type="radio" @change="chooseCategory(item)">
                        <span>{{ item.title }}</span>
                      </label>
                    </li>
                  </ul>

                  <div class="frames__categories-empty">
                    <span v-if="!searchResults.length">No results</span>
                    <button
                      type="button"
                      @click="createNewCategory"
                    >Save new category</button>
                  </div>
                </div>
              </div> -->
</template>

<script lang="ts">

import { defineComponent, Ref, ref, reactive } from 'vue'
import InputText from '~/components/Inputs/InputText.vue'
import Textarea from '~/components/Inputs/Textarea.vue'
import Button from '~/components/Button/Button.vue'
import AppSprite from '~/components/AppSprite.vue'
import api from '~/api'
import './FrameForm.scss'

export default defineComponent({
  components: {
    InputText,
    Textarea,
    Button,
    AppSprite
  },

  setup() {
    const inputTimer: Ref<ReturnType<typeof setTimeout> | number> = ref(0)

    const newFrame = reactive({
      title: '',
      frame: '',
      artist: { id: '', title: 'Artist' },
      genre: { id: '', title: 'Genre' },
      period: { id: '', title: 'Year' }
    })

    const categoryState = reactive({
      isActive: false,
      key: '',
      results: []
    })

    const setFrameTitle = (value: string) => {
      newFrame.title = value
    }

    const setFrameCode = (value: any) => {
      newFrame.frame = value
    }

    const openCloseCategoryList = (key: string) => {
      categoryState.isActive = !categoryState.isActive
      categoryState.key = key
      categoryState.results = []
    }

    const setSearchResults = (data: any) => {
      console.log(data)
      categoryState.results = data
    }

    const postSearchQuery = async (query: string) => {
      const payload = {
        query,
        key: categoryState.key
      }

      try {
        const response = await api.post('/api/search', payload)
        
        if (response?.status === 200) {
          setSearchResults(response.data)
        }
      } catch (error) {
        console.error(error)
      }
    }

    const searchByQuery = (value: string) => {
      if (typeof inputTimer.value === 'number') {
        clearTimeout(inputTimer.value)
        inputTimer.value = setTimeout(() => postSearchQuery(value), 2000)
      }
    }

    const saveNewFrame = () => {
      console.log('submit')
    }

    return {
      newFrame,
      setFrameTitle,
      setFrameCode,
      openCloseCategoryList,
      searchByQuery,
      categoryState,
      saveNewFrame
    }
  },
})

</script>

