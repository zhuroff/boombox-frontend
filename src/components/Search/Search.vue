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
      v-if="!searchResults.isFetching && (searchString.length || searchResults.errorMessage)"
      :results="searchResults.data"
      :errorMessage="searchResults.errorMessage"
      @cleanSearchResults="cleanSearchResults"
    />
  </form>
</div>

</template>

<script lang="ts">

import { defineComponent, ref, reactive, watch, Ref } from 'vue'
import { SearchedResult, SearchPayload, SearchResultState } from '~/types/Search'
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
      data: [],
      errorMessage: null
    })

    const cleanSearchResults = () => {
      searchString.value = ''
      searchResults.data = []
      searchResults.errorMessage = null
    }

    const setSearchResults = (result: SearchResultState[]) => {
      searchResults.isFetching = false
      
      if (!result?.length) {
        searchResults.errorMessage = 'Nothing was found'
      } else {
        searchResults.data = result
        searchResults.errorMessage = null
      }
    }

    const searchBySite = (query: string) => {
      const payload: SearchPayload = { query }

      SearchServices.search(payload)
        .then((result) => setSearchResults(result))
        .catch(_ => {
          searchResults.isFetching = false
          searchResults.errorMessage = 'Nothing was found'
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
  position: relative;
  padding: 0 25px;

  &__close {
    position: absolute;
    right: 14px;
    top: 8px;
    width: 15px;
    height: 15px;
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
    height: 30px;
    width: 100%;
    outline: none;
    border: 0;
    border-bottom: 1px solid transparent;
    padding: 0;
    transition: border-color 0.3s ease;
    background-color: transparent;

    &:focus {
      border-color: $border;
    }
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
