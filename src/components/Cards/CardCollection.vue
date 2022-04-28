<template>

<router-link
  class="album__link"
  :to="{ path: `/${slug}/${data._id}` }"
>
  <div class="album__image">
    <img
      :src="host(data.avatar)"
      :alt="data.title"
      class="album__image_img"
    >

    <img
      src="/img/vinyl.png"
      alt="vinyl placeholder"
      class="album__image_vinyl"
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
import { hostString } from '~/shared/media'
import { CollectionListItem } from '~/types/Collection'
import { PlayListItem } from '~/types/Playlist'

export default defineComponent({
  name: 'CardCollection',

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
  },

  setup() {
    const host = (pathname: string) => (
      pathname ? hostString(pathname) : '/img/album.webp'
    )

    return { host }
  }
})

</script>
