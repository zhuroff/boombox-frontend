<template>
  <form class="form-frame">
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
      <button
        type="button"
        class="frames__form-button"
        @click="callCategoryList('artists')"
      >{{ newArtist.title }}</button>
    </div>

    <div class="form-frame__row">
      <button
        type="button"
        class="frames__form-button"
        @click="callCategoryList('genres')"
      >{{ newGenre.title }}</button>
    </div>

    <div class="form-frame__row">
      <button
        type="button"
        class="frames__form-button"
        @click="callCategoryList('periods')"
      >{{ newPeriod.title }}</button>
    </div>

    <div class="form-frame__row">
      <input
        type="submit"
        class="frames__form-submit"
        value="Save"
      >
    </div>
  </form>

  <!-- <div
                v-if="isCategoryListActive"
                class="frames__categories"
              >
                <div class="frames__categories-title">{{ categoryKey }}</div>

                <button
                  class="frames__categories-close"
                  @click="closeCategoryList"
                >
                  <AppSprite name="delete" />
                </button>

                <AppInput
                  type="search"
                  placeholder="Category name"
                  v-model="categorySearchQuery"
                  @input="searchCategory"
                />

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

import { defineComponent, reactive } from 'vue'
import InputText from '~/components/Inputs/InputText.vue'
import Textarea from '~/components/Inputs/Textarea.vue'
import './FrameForm.scss'

export default defineComponent({
  components: {
    InputText,
    Textarea
  },

  setup() {
    const newArtist = reactive({ id: '', title: 'Artist' })
    const newGenre = reactive({ id: '', title: 'Genre' })
    const newPeriod = reactive({ id: '', title: 'Year' })

    const categoryState = reactive({
      isActive: false,
      key: '',
      search: ''
    })

    const setFrameTitle = (value: string) => {
      console.log(value)
    }

    const setFrameCode = (value: any) => {
      console.log(value)
    }

    const callCategoryList = (key: string) => {
      categoryState.isActive = true
      categoryState.key = key
    }

    return {
      newArtist,
      newGenre,
      newPeriod,
      setFrameTitle,
      setFrameCode,
      callCategoryList
    }
  },
})

</script>

