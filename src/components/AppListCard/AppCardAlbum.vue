<template>

<router-link
  class="album__link"
  :to="{ path: `/albums/${album._id}` }"
>
  <transition-group name="fade">
    <div
      v-if="album.preloader"
      class="album__cover_skeleton"
    ></div>

    <div class="album__cover" v-else>
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
  </transition-group>

  <transition-group name="fade">
    <div
      v-if="album.preloader"
      class="album__title_skeleton"
    ></div>

    <div
      v-else
      class="album__title"
    >{{ album.title }}</div>
  </transition-group>

  <transition-group name="fade">
    <div
      v-if="album.preloader"
      class="album__info_skeleton"
    ></div>

    <div
      v-else
      class="album__info"
    >
      {{ album.artist.title }}, {{ album.releaseYear || album.period.title }} / {{ album.genre.title }}
    </div>
  </transition-group>
</router-link>

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
