<template>
  <div class="album__hero-cover">
    <CoverArt
      :cover="album.coverURL || coverPlaceholders('album')"
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
      <br />
      {{ localize('conjugated.tracks.plural') }}:&nbsp;
      <span class="album__hero-category">{{ album.tracks.length }}</span>
      <br />
      {{ localize('totalLength') }}:&nbsp;
      <span class="album__hero-category">{{ length }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { coverPlaceholders } from '~/utils'
import useGlobalStore from '~/store/global'
import CoverArt from '~/components/CoverArt.vue'

interface Props {
  album: Album
  length: string
}

const props = defineProps<Props>()

const { globalGetters: { localize } } = useGlobalStore()
</script>
