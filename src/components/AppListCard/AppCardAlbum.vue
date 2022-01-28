<template>

<router-link
  class="album__link"
  :to="{ path: `/albums/${album._id}` }"
>
  <transition-group name="fade">
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
  </transition-group>

  <transition-group name="fade">
    <div
      class="album__title"
    >{{ album.title }}</div>
  </transition-group>

  <transition-group name="fade">
    <div
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
