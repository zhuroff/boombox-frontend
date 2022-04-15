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
        @onClick="openCategoryList('artists')"
      />
    </div>

    <div class="form-frame__row">
      <Button
        :text="newFrame.genre.title"
        isFullWidth
        @onClick="openCategoryList('genres')"
      />
    </div>

    <div class="form-frame__row">
      <Button
        :text="newFrame.period.title"
        isFullWidth
        @onClick="openCategoryList('periods')"
      />
    </div>

    <div class="form-frame__row">
      <Button
        text="Save"
        type="submit"
        :isDisabled="isSubmitDisabled"
      />
    </div>

    <div
      v-if="activeCategory.isActive"
      class="form-frame__categories"
    >
      <div class="form-frame__heading">{{ activeCategory.key }}</div>
      <button
        class="form-frame__close"
        @click="closeCategoryList"
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
      
      <FrameResults
        v-if="activeCategory.results.length"
        :items="activeCategory.results"
        :defaultAvatar="keysMatcher[activeCategory.key]"
        @selectCategory="selectCategory"
      />

      <div
        v-if="isNotFound"
        class="form-frame__empty"
      >
        <span>No results</span>
        <Button
          text="Save new category"
          @onClick="createCategory"
        />
      </div>
    </div>
  </form>
</template>

<script lang="ts">

import { defineComponent, Ref, ref, reactive, computed } from 'vue'
import { CategoryKeysPlural, CategoryKeysSingular, CategorySearchResult, ICategoryBasic } from '~/types/Category'
import { FrameBasic } from '~/types/Frame'
import InputText from '~/components/Inputs/InputText.vue'
import Textarea from '~/components/Inputs/Textarea.vue'
import Button from '~/components/Button/Button.vue'
import AppSprite from '~/components/AppSprite.vue'
import FrameResults from './FrameResults.vue'
import CategoryServices from '~/services/CategoryServices'
import FrameServices from '~/services/FrameServices'
import api from '~/api'
import './FrameForm.scss'

export default defineComponent({
  components: {
    InputText,
    Textarea,
    Button,
    AppSprite,
    FrameResults
  },

  setup(_, { emit }) {
    const inputTimer: Ref<ReturnType<typeof setTimeout> | number> = ref(0)
    const searchQuery = ref('')
    const isSubmitDisabled = ref(false)

    const keysMatcher = reactive<{ [index: string]: CategoryKeysSingular }>({
      artists: 'artist',
      genres: 'genre',
      periods: 'period'
    })

    const newFrame = reactive<FrameBasic>({
      title: '',
      frame: '',
      artist: { _id: '', title: 'Artist' },
      genre: { _id: '', title: 'Genre' },
      period: { _id: '', title: 'Year' }
    })

    const activeCategory = reactive({
      isActive: false,
      isFetched: false,
      key: '' as CategoryKeysPlural,
      results: [] as CategorySearchResult[]
    })

    const isNotFound = computed(() => (
      activeCategory.isActive && !activeCategory.results.length && searchQuery.value.length && activeCategory.isFetched
    ))

    const setFrameTitle = (value: string) => {
      newFrame.title = value
    }

    const setFrameCode = (value: string) => {
      newFrame.frame = value
    }

    const openCategoryList = (key: CategoryKeysPlural) => {
      activeCategory.isActive = true
      activeCategory.key = key
      activeCategory.results = []
    }

    const closeCategoryList = () => {
      activeCategory.isActive = false
      activeCategory.results = []
    }

    const setSearchResults = (data: CategorySearchResult[]) => {
      activeCategory.results = data
    }

    const postSearchQuery = async (query: string) => {
      const payload = {
        query,
        key: activeCategory.key
      }

      try {
        const response = await api.post('/api/search', payload)
        
        if (response?.status === 200) {
          activeCategory.isFetched = true
          setSearchResults(response.data)
        }
      } catch (error) {
        console.error(error)
      }
    }

    const searchByQuery = (value: string) => {
      searchQuery.value = value
      activeCategory.isFetched = false

      if (typeof inputTimer.value === 'number') {
        clearTimeout(inputTimer.value)
        inputTimer.value = setTimeout(() => postSearchQuery(searchQuery.value), 1000)
      }
    }

    const saveNewFrame = () => {
      isSubmitDisabled.value = true

      FrameServices.create(newFrame)
        .then((frame) => emit('addNewFrame', frame))
        .catch((error) => console.dir(error))
    }

    const selectCategory = (category: CategorySearchResult | ICategoryBasic) => {
      newFrame[keysMatcher[activeCategory.key]] = {
        _id: category._id,
        title: category.title
      }

      closeCategoryList()
    }

    const createCategory = () => {
      CategoryServices.create(activeCategory.key, searchQuery.value)
        .then((result) => selectCategory(result))
        .catch((error) => console.dir(error))
    }

    return {
      searchQuery,
      isSubmitDisabled,
      newFrame,
      setFrameTitle,
      setFrameCode,
      openCategoryList,
      searchByQuery,
      activeCategory,
      isNotFound,
      saveNewFrame,
      selectCategory,
      closeCategoryList,
      keysMatcher,
      createCategory
    }
  },
})

</script>

