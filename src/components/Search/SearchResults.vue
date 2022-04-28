<template>
  <div class="search__results">
    <div class="search__heading">{{ heading }}</div>
    <ul class="search__list">

      <SearchItem
        v-for="item in list"
        :key="item._id"
        :item="item"
        :slug="slug"
        :section="slug"
      />

    </ul>
  </div>
</template>

<script lang="ts">

import { defineComponent } from 'vue'

export default defineComponent({
  name: 'SearchResults',

  props: {
    heading: {
      type: String,
      required: true
    },

    slug: {
      type: String,
      required: true
    },

    list: {
      type: Array,
      required: true
    }
  },

  setup() {
    
  }
})

</script>
