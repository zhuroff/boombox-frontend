<template>
  
<div class="album__frame">
  <div
    class="album__player"
    v-html="album.iframe"
  ></div>

  <router-link
    :to="{ path: `/frames/${album._id}` }"
  >
    <div class="album__title">{{ album.title }}</div>
    <div lass="album__info">
      {{ album.artist.title }}, {{ album.releaseYear.title }} / {{ album.genre.title }}
    </div>
  </router-link>
</div>

</template>

<script>

import { defineComponent } from 'vue'

export default defineComponent({
  props: {
    album: {
      type: Object,
      required: true
    }
  }
})

</script>
