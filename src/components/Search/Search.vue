<template>

<div class="search">
  <button
    v-if="searchString.length"
    class="search__close"
    @click.prevent="cleanSearchResults"
  >
    <Sprite name="delete" />
  </button>

  <form class="search__form">
    <input
      type="search"
      class="search__input"
      v-model="searchString"
      placeholder="Search..."
    >

    <SearchResults
      v-if="!searchResults.isFetching && searchString.length"
      :results="searchResults.data"
    />

    <!-- <div
      v-if="!searchResults.isFetching && searchString.length"
      class="search__modal"
      id="scrollmodal"
    >
      <div
        v-if="searchResults.albums.length"
        class="search__results"
      >
        <div class="search__heading">Albums</div>
        <ul class="search__list">

          <SearchItem
            v-for="item in searchResults.albums"
            :key="item._id"
            :item="item"
            slug="albums"
            section="albums"
          />

        </ul>
      </div>

      <div
        v-if="searchResults.frames.length"
        class="search__results"
      >
        <div class="search__heading">Frame albums</div>
        <ul class="search__list">

          <SearchItem
            v-for="item in searchResults.frames"
            :key="item._id"
            :item="item"
            slug="frames"
            section="frames"
          />

        </ul>
      </div>

      <div
        v-if="searchResults.artists.length"
        class="search__results"
      >
        <div class="search__heading">Artists</div>
        <ul class="search__list">

          <SearchItem
            v-for="item in searchResults.artists"
            :key="item._id"
            :item="item"
            slug="artists"
            section="artists"
          />

        </ul>
      </div>

      <div
        v-if="searchResults.genres.length"
        class="search__results"
      >
        <div class="search__heading">Genres</div>
        <ul class="search__list">

          <SearchItem
            v-for="item in searchResults.genres"
            :key="item._id"
            :item="item"
            slug="genres"
            section="genres"
          />

        </ul>
      </div>

      <div
        v-if="searchResults.periods.length"
        class="search__results"
      >
        <div class="search__heading">Years</div>
        <ul class="search__list">

          <SearchItem
            v-for="item in searchResults.periods"
            :key="item._id"
            :item="item"
            slug="periods"
            section="periods"
          />

        </ul>
      </div>
    </div> -->
  </form>
</div>

</template>

<script lang="ts">

import { defineComponent, ref, reactive, watch, Ref } from 'vue'
import { SearchedResult, SearchEntityKey, SearchPayload, SearchResult } from '~/types/Search'
import SearchServices from '~/services/SearchServices'
import SearchResults from './SearchResults.vue'
import Sprite from '~/components/Sprite/Sprite.vue'

export default defineComponent({
  name: 'Search',

  components: {
    SearchResults,
    Sprite
  },

  setup() {
    const searchString = ref('')
    const inputTimer: Ref<ReturnType<typeof setTimeout> | number> = ref(0)

    const searchResults = reactive<SearchedResult>({
      isFetching: false,
      data: new Map()
    })

    const cleanSearchResults = () => {
      // searchString.value = ''
      // scrollModal.value = null

      // delete searchResults.albums
      // delete searchResults.artists
      // delete searchResults.genres
      // delete searchResults.frames
      // delete searchResults.periods
    }

    const setSearchResults = (result: SearchResult) => {
      Object.keys(result).forEach((key) => {
        searchResults.data.set(key as SearchEntityKey, result[key as SearchEntityKey])
      })
      searchResults.isFetching = false
    }

    const searchBySite = (query: string) => {
      const payload: SearchPayload = { query }

      SearchServices.search(payload)
        .then((result) => setSearchResults(result))
        .catch((error) => {
          searchResults.isFetching = false
          console.dir(error)
        })
    }

    watch(searchString, (newValue) => {
      if (typeof inputTimer.value === 'number') {
        searchResults.isFetching = true
        clearTimeout(inputTimer.value)
        
        inputTimer.value = setTimeout(() => {
          searchBySite(newValue)
        }, 1000)
      }
    })

    return {
      searchString,
      searchResults,
      cleanSearchResults,
      searchBySite
    }
  }
})

</script>

<style lang="scss" scoped>

@import '~/scss/variables';

.search {
  width: calc(100% - 40px - 24px);
  max-width: 500px;
  position: relative;

  &__close {
    position: absolute;
    right: 10px;
    top: calc(100% + 5px);
    width: 30px;
    height: 30px;
    outline: none;
    background-color: transparent;
    border: 0;
    padding: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 10;

    .icon-delete {
      width: 10px;
      height: 10px;
      fill: $pale;
    }

    &:hover {

      .icon-delete {
        fill: $dark;
      }
    }
  }

  &__form {
   width: 100%;
  }

  &__input {
    height: 40px;
    width: 100%;
    outline: none;
    border: 0;
    border-bottom: 1px solid transparent;
    padding: 0;
    transition: border-color 0.3s ease;
  }

  &__modal {
    position: absolute;
    border-bottom-left-radius: 3px;
    border-bottom-right-radius: 3px;
    border: 1px solid $border;
    border-top: 0;
    padding: 24px;
    width: 100%;
    background-color: $white;
    box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
    max-height: 400px;
  }

  &__results {
    margin-bottom: 16px;

    &:last-child {
      margin-bottom: 0;
    }
  }

  &__heading {
    text-transform: uppercase;
    font-size: 12px;
    font-weight: 600;
    color: $pale;
    border-bottom: 1px solid $border;
    padding-bottom: 3px;
    margin-bottom: 10px;
  }

  &__list {
    margin: 0 -5px;
  }
}

</style>
