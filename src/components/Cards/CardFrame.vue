<template>
  
<div class="album__frame">
  <div
    class="album__player"
    v-html="album.frame"
  ></div>

  <router-link
    :to="{ path: `/frames/${album._id}` }"
  >
    <div class="album__title">{{ album.title }}</div>
    <div class="album__info">
      {{ album.artist.title }}, {{ album.period.title }} / {{ album.genre.title }}
    </div>
  </router-link>
</div>

</template>

<script lang="ts">

import { defineComponent, PropType } from 'vue'
import { FrameAlbum } from '~/types/Frame'

export default defineComponent({
  name: 'CardFrame',

  props: {
    album: {
      type: Object as PropType<FrameAlbum>,
      required: true
    }
  }
})

</script>
