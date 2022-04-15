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

import { defineComponent } from 'vue'
import { FramePage } from '~/types/Frame'

export default defineComponent({
  props: {
    album: {
      type: Object as () => FramePage,
      required: true
    }
  }
})

</script>
