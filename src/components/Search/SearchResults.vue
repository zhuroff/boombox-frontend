<template>
  <div
    v-if="errorMessage"
    class="search__results"
  >{{ errorMessage }}</div>
  
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

import { defineComponent, onMounted, PropType } from 'vue'
import SimpleBar from 'simplebar'
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

.search {

  &__results {
    position: absolute;
    top: 100%;
    left: 0;
    background-color: $white;
    width: 100%;
    border-radius: 5px;
    box-shadow: rgb(0 0 0 / 35%) 0px 5px 15px;
  }

  &__section {

    &-title {
      font-weight: 600;
      font-size: 14px;
      display: block;
      color: $dark;
      text-transform: uppercase;
      margin: 10px 15px;
    }
  }
}

</style>
