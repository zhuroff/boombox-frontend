<template>
  <div class="album__hero-cover">
    <CoverArt
      :cover="album.avatar ? hostString(album.avatar) : coverPlaceholders('album')"
    />
  </div>
  <div class="album__hero-info">
    <slot name="hero"></slot>
    <div class="album__hero-summary">
      {{ localize('conjugated.tracks.plural') }}:&nbsp;
      <span class="album__hero-category">{{ album.tracks.length }}</span>
      <br />
      {{ localize('totalLength') }}:&nbsp;
      <span class="album__hero-category">{{ length }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { hostString, coverPlaceholders } from '~/utils'
import useGlobalStore from '~/store/global'
import CoverArt from '~/components/CoverArt.vue'

interface Props {
  album: Compilation
  length: string
}

const props = defineProps<Props>()

const { globalGetters: { localize } } = useGlobalStore()
</script>
