<template>

<router-link
  class="album__link"
  :to="{ path: `/albums/${album._id}` }"
>
  <div class="album__cover">
    <img
      :src="album.albumCover"
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
    {{ album.artist.title }}, {{ album.releaseYear || album.period.title }} / {{ album.genre.title }}
  </div>
</router-link>

</template>

<script lang="ts">

import { defineComponent, PropType } from 'vue'
import { AlbumItem } from '~/types/Album'

export default defineComponent({
  name: 'CardAlbum',

  props: {
    album: {
      type: Object as PropType<AlbumItem>,
      required: true
    }
  }
})

</script>
