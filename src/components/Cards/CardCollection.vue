<template>

<router-link
  class="album__link"
  :to="{ path: `/${slug}/${album._id}` }"
>
  <div class="album__cover">
    <img
      :src="album.poster || '/img/album.jpg'"
      :alt="album.title"
      class="album__cover_img"
    >

    <img
      src="/img/vinyl.png"
      alt="vinyl placeholder"
      class="album__cover_vinyl"
    >
  </div>

  <div class="album__title">{{ album.title }}</div>

  <div class="album__info">
    Albums in collection: {{ album.albums.length }}
  </div>
</router-link>

</template>

<script lang="ts">

import { defineComponent, PropType } from 'vue'
import { CollectionListItem } from '~/types/Collection'

export default defineComponent({
  props: {
    album: {
      type: Object as PropType<CollectionListItem>,
      required: true
    },

    slug: {
      type: String,
      required: true
    }
  }
})

</script>
