<template>
  <div
    v-if="errorMessage"
    class="search__results"
  >
    <div class="search__results-empty">{{ errorMessage }}</div>
  </div>
  
  <div
    v-else
    class="search__results"
  >
    <div
      class="search__section"
      v-for="{ title, key, data } in results"
      :key="title"
    >
      <div class="search__section-title">{{ title }}</div>
      <ul class="search__section-list">
        <SearchResultsItem
          v-for="item in data"
          :key="item._id"
          :item="item"
          :slug="key"
          @cleanSearchResults="cleanSearchResults"
        />
      </ul>
    </div>
  </div>
</template>

<script lang="ts">

import { defineComponent, PropType } from 'vue'
import { SearchResultState } from '~/types/Search'
import SearchResultsItem from './SearchResultsItem.vue'

export default defineComponent({
  name: 'SearchResults',

  components: {
    SearchResultsItem
  },

  props: {
    results: {
      type: Array as PropType<SearchResultState[]>,
      required: true
    },

    errorMessage: {
      type: String,
      required: false
    }
  },

  setup(_, { emit }) {
    const cleanSearchResults = () => {
      emit('cleanSearchResults')
    }

    return { cleanSearchResults }
  }
})

</script>

<style lang="scss" scoped>

@import '~/scss/variables';
@import 'include-media';

.search {

  &__results {
    position: absolute;
    top: 100%;
    background-color: $white;
    width: 100vw;
    max-width: 300px;
    border-radius: 5px;
    box-shadow: rgb(0 0 0 / 35%) 0px 5px 15px;
    padding: 10px 0;

    @include media('<laptop') {
      right: 25px;
    }

    @include media('>=laptop') {
      left: 25px;
    }

    &-empty {
      padding: 0 15px;
      font-size: 14px;
      font-weight: 600;
      color: $error;
    }
  }

  &__section {

    &-title {
      font-weight: 600;
      font-size: 14px;
      display: block;
      color: $dark;
      text-transform: uppercase;
      margin: 5px 15px;
    }
  }
}

</style>
