<template>
  <section class="section">
    <div id="scrollspace">
      <ul v-if="albums.isFetched" class="cardlist">
        <AppCardWrapper
          v-for="album in albums.data"
          :key="album._id"
          deletable
          @deleteItem="deleteFrameAlbum(album._id)"
        >
          <!-- <AppCardFrame
            :album="album"
          /> -->
        </AppCardWrapper>
      </ul>

      <transition name="slide">
        <div
          v-if="isModalActive"
          class="frames__form-wrapper"
        >
          <button
            class="frames__form-close"
            @click="closeModalForm"
          >
            <AppSprite name="delete" />
          </button>

          <form
            class="frames__form"
            @submit.prevent="submitForm"
          >
            <!-- <AppInput
              placeholder="Album title"
              v-model="newAlbumTitle"
            />

            <AppInput
              type="textarea"
              placeholder="iFrame"
              v-model="newAlbumFrame"
            /> -->

            <button
              type="button"
              class="frames__form-button"
              @click="callCategoryList('artists')"
            >{{ newAlbumArtist.title }}</button>

            <button
              type="button"
              class="frames__form-button"
              @click="callCategoryList('genres')"
            >{{ newAlbumGenre.title }}</button>

            <button
              type="button"
              class="frames__form-button"
              @click="callCategoryList('periods')"
            >{{ newAlbumYear.title }}</button>

            <input
              type="submit"
              class="frames__form-submit"
              value="Save"
            >

            <transition name="slide">
              <div
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

                <!-- <AppInput
                  type="search"
                  placeholder="Category name"
                  v-model="categorySearchQuery"
                  @input="searchCategory"
                /> -->

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
              </div>
            </transition>
          </form>
        </div>
      </transition>

      <button
        class="frames__create"
        @click="callCreatingModal"
      >Add new album</button>
    </div>
  </section>
</template>

<script lang="ts">

import { defineComponent, Ref, ref, reactive, watchEffect } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { IPagination } from '~/types/Global'
import { IFrameBasic } from '~/types/Frame'
import AppSprite from '~/components/AppSprite.vue'
// import AppInput from '~/components/AppInput.vue'
import AppCardWrapper from '~/components/AppListCard/AppCardWrapper.vue'
// import AppCardFrame from '~/components/AppListCard/AppCardFrame.vue'
import api from '~/api'

export default defineComponent({
  components: {
    AppSprite,
    // AppInput,
    AppCardWrapper,
    // AppCardFrame
  },

  setup() {
    const router = useRouter()
    const route = useRoute()
    const searchTimer: Ref<ReturnType<typeof setTimeout> | number> = ref(0)

    const page = ref(route.query.p || 1)
    const limit = ref(40)
    const sort = reactive({ title: 1 })
    const searchResults = ref(null)

    const albums = reactive({
      isFetched: false,
      data: [] as IFrameBasic[],
      pagination: {} as IPagination
    })

    if (!route.query.p) {
      router.push({ query: { p: page.value } })
    }

    const isModalActive = ref(false)
    const isCategoryListActive = ref(false)
    const categorySearchQuery = ref('')
    const categoryKey = ref('')

    const newAlbumTitle = ref('')
    const newAlbumFrame = ref('')
    const newAlbumArtist = reactive({ id: '', title: 'Artist' })
    const newAlbumGenre = reactive({ id: '', title: 'Genre' })
    const newAlbumYear = reactive({ id: '', title: 'Year' })

    const deleteFrameAlbum = async (id: string) => {
      try {
        const targetAlbumIndex = albums.data.findIndex((el) => el._id === id)
        let albumGhost

        if (targetAlbumIndex > -1) {
          albumGhost = albums.data.splice(targetAlbumIndex, 1)
        }

        if (albumGhost) {
          const payload = {
            artist: albumGhost[0].artist._id,
            genre: albumGhost[0].genre._id,
            period: albumGhost[0].period._id
          }

          const response = await api.post(`/api/frames/${id}/delete`, payload)
          console.log(response)
        }
      } catch (error) {
        console.error(error)
      }
    }

    const closeModalForm = () => {
      isModalActive.value = false
      isCategoryListActive.value = false
      categorySearchQuery.value = ''
      searchResults.value = null
      newAlbumTitle.value = ''
      newAlbumFrame.value = ''
      newAlbumArtist.id = ''
      newAlbumGenre.id = ''
      newAlbumYear.id = ''
    }

    const submitForm = async () => {
      const payload = {
        title: newAlbumTitle.value,
        artist: newAlbumArtist.id,
        genre: newAlbumGenre.id,
        releaseYear: newAlbumYear.id,
        iframe: newAlbumFrame.value
      }

      try {
        const response = await api.post('/api/frames/create', payload)

        albums.data.unshift(response.data)
        closeModalForm()
      } catch (error) {
        throw error
      }
    }

    const callCreatingModal = () => {
      isModalActive.value = true
    }

    const callCategoryList = (key: string) => {
      isCategoryListActive.value = true
      categoryKey.value = key
    }

    const closeCategoryList = () => {
      isCategoryListActive.value = false
      categorySearchQuery.value = ''
      searchResults.value = null
    }

    const fetchSearchedCategory = async (query: any) => {
      console.log(query)
      try {
        const payload = {
          query,
          key: categoryKey.value
        }

        const response = await api.post('/api/search', payload)
        searchResults.value = response.data
      } catch (error) {
        throw error
      }
    }

    const searchCategory = (event: any) => {
      if (typeof searchTimer.value === 'number') {
        clearTimeout(searchTimer.value)
        searchTimer.value = setTimeout(() => {
          fetchSearchedCategory(event?.target?.value)
        }, 1000)
      }
    }

    const chooseCategory = (item: any) => {
      console.log(item)
      if (categoryKey.value === 'artists') {
        newAlbumArtist.id = item._id
        newAlbumArtist.title = item.title
      }

      if (categoryKey.value === 'genres') {
        newAlbumGenre.id = item._id
        newAlbumGenre.title = item.title
      }

      if (categoryKey.value === 'periods') {
        newAlbumYear.id = item._id
        newAlbumYear.title = item.title
      }

      closeCategoryList()
    }

    const createNewCategory = async () => {
      const payload = {
        category: categoryKey.value,
        value: categorySearchQuery.value
      }

      try {
        const response = await api.post('/api/synchronize/create', payload)
        chooseCategory(response.data)
      } catch (error) {
        console.error(error)
      }
    }

    const fetchBCAlbums = async () => {
      const payload = { page: page.value, limit: limit.value, sort }

      try {        
        const response = await api.post('/api/frames', payload)
        albums.data = response.data.docs
        albums.isFetched = true
      } catch (error) {
        throw error
      }
    }

    fetchBCAlbums()

    watchEffect(() => {
      if (isModalActive.value) {
        document.querySelector('.header')?.classList.add('--z-low')
        document.querySelector('.player')?.classList.add('--z-low')
      } else {
        document.querySelector('.header')?.classList.remove('--z-low')
        document.querySelector('.player')?.classList.remove('--z-low')
      }
    })

    return {
      albums,
      deleteFrameAlbum,
      isModalActive,
      isCategoryListActive,
      newAlbumTitle,
      newAlbumArtist,
      newAlbumGenre,
      newAlbumYear,
      newAlbumFrame,
      submitForm,
      callCreatingModal,
      callCategoryList,
      closeModalForm,
      closeCategoryList,
      categoryKey,
      categorySearchQuery,
      searchCategory,
      searchResults,
      chooseCategory,
      createNewCategory
    }
  }
})

</script>

<style lang="scss" scoped>

@import '~/scss/variables';

.frames {

  &__form-wrapper {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100vw;
    height: 100vh;
    padding: 50px 25px;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 5000;
    background-color: rgba(0, 0, 0, 0.75);
  }

  &__form-close {
    @include buttonClose;
  }

  &__form {
    background-color: $white;
    flex: none;
    width: calc(100vw - 40px);
    max-width: 500px;
    border-radius: 5px;
    padding: 25px;
    position: relative;
    overflow: hidden;

    &-button {
      margin-bottom: 5px;
      display: block;
      width: 100%;
      height: 35px;
      border: 1px solid $pale;
      background-color: $border;
      outline: none;
    }

    &-submit {
      height: 35px;
      border-radius: 3px;
      border: 1px solid $dark;
      background-color: $dark;
      color: $white;
      outline: none;
      float: right;
      padding: 0 20px;
    }
  }

  &__create {
    // @include button;
    margin: 0 25px 25px;
    width: calc(100% - 50px);
  }

  &__categories {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: $white;
    padding: inherit;
    
    &-close {
      position: absolute;
      padding: 0;
      background-color: transparent;
      border: 0;
      z-index: 10;
      width: 15px;
      height: 15px;
      top: 15px;
      right: 15px;

      .icon-delete {
        fill: $dark;
      }
    }

    &-title {
      font-weight: 600;
      margin-bottom: 16px;

      &::first-letter {
        text-transform: uppercase;
      }
    }

    &-list {
      margin-top: 10px;
    }

    &-item {

      label {
        cursor: pointer;
        display: flex;
        align-items: center;
        padding: 10px 10px;
        position: relative;
        border-radius: 5px;

        &:hover {
          background-color: $border;
        }

        input {
          opacity: 0;
          width: 0;
          height: 0;
          position: absolute;
          top: 0;
          left: 0;
          outline: none;
        }

        span {
          font-weight: 600;
          font-size: 14px;
        }
      }
    }
  }
}

</style>
