<template>
  <div class="album__hero-cover">
    <div
      v-html="album.frame"
      class="album__frame"
    />
  </div>
  <div class="album__hero-info">
    <slot name="hero"></slot>
    <div class="album__hero-summary">
      {{ localize('embeddedForm.artist') }}:&nbsp;
      <RouterLink
        v-if="album.artist?.title"
        :to="`/artists/${album.artist._id}`"
        :disabled="!album.artist._id"
        class="album__hero-category --link"
      >
        {{ album.artist.title }}
      </RouterLink>
      <br />
      {{ localize('embeddedForm.period') }}:&nbsp;
      <RouterLink
        v-if="album.period?.title"
        :to="`/periods/${album.period._id}`"
        :disabled="!album.period._id"
        class="album__hero-category --link"
      >
        {{ album.period.title }}
      </RouterLink>
      <br />
      {{ localize('embeddedForm.genre') }}:&nbsp;
      <RouterLink
        v-if="album.genre?._id"
        :to="`/genres/${album.genre._id}`"
        :disabled="!album.genre._id"
        class="album__hero-category --link"
      >
        {{ album.genre.title }}
      </RouterLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import useGlobalStore from '~/store/global'

interface Props {
  album: Embedded
}

const props = defineProps<Props>()
const { globalGetters: { localize } } = useGlobalStore()
</script>
