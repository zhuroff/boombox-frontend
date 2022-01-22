<template>
  
<div class="album__frame">
  <div
    class="album__player"
    v-html="album.iframe"
  ></div>

  <router-link
    :to="{ path: `/frames/${album._id}` }"
  >
    <transition-group name="fade">
      <div
        v-if="album.preloader"
        class="album__title_skeleton"
      ></div>

      <div
        v-else
        class="album__title"
      >{{ album.title }}</div>

      <div
        v-if="album.preloader"
        class="album__info_skeleton"
      ></div>

      <div
        v-else
        class="album__info"
      >
        {{ album.artist.title }}, {{ album.releaseYear.title }} / {{ album.genre.title }}
      </div>
    </transition-group>
  </router-link>
</div>

</template>

<script>

export default {
  props: {
    album: {
      type: Object,
      required: true
    }
  }
}

</script>
