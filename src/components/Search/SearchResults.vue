<template>
  <div class="search__results">
    <!-- <div class="search__heading">{{ heading }}</div>
    <ul class="search__list">

      <SearchItem
        v-for="item in list"
        :key="item._id"
        :item="item"
        :slug="slug"
        :section="slug"
      />

    </ul> -->
  </div>
</template>

<script lang="ts">

import { defineComponent, onMounted, PropType } from 'vue'
import SimpleBar from 'simplebar'
import { SearchedData } from '~/types/Search'

export default defineComponent({
  name: 'SearchResults',

  props: {
    results: {
      type: Map as PropType<SearchedData>,
      required: true
    }
  },

  setup(props) {
    onMounted(() => {
      console.log(props.results)
    })
  }
})

</script>
