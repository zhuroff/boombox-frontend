<template>

<router-link
  class="album__link"
  :to="{ path: `/${slug}/${data._id}` }"
>
  <div class="album__cover">
    <img
      :src="data.poster || '/img/album.jpg'"
      :alt="data.title"
      class="album__cover_img"
    >

    <img
      src="/img/vinyl.png"
      alt="vinyl placeholder"
      class="album__cover_vinyl"
    >
  </div>

  <div class="album__title">{{ data.title }}</div>

  <div class="album__info">
    {{ title }} {{ data.albums?.length || data.tracks?.length }}
  </div>
</router-link>

</template>

<script lang="ts">

import { defineComponent, PropType } from 'vue'
import { CollectionListItem } from '~/types/Collection'
import { PlayListItem } from '~/types/Playlist'

export default defineComponent({
  props: {
    data: {
      type: Object as PropType<CollectionListItem | PlayListItem>,
      required: true
    },

    title: {
      type: String,
      required: true
    },

    slug: {
      type: String,
      required: true
    }
  }
})

</script>
