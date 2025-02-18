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
    <div class="album__hero-actions">
      <Button
        icon="loupe"
        isRounded
        isInverted
      />
      <Button
        icon="target"
        isRounded
        isInverted
        @click="getRandomAlbum"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { hostString, coverPlaceholders } from '~/utils'
import useGlobalStore from '~/store/global'
import CoverArt from '~/components/CoverArt.vue'
import Button from '../Button.vue'

interface Props {
  album: Compilation
  length: string
}

interface Emits {
  (e: 'getRandomAlbum'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const { globalGetters: { localize } } = useGlobalStore()

const getRandomAlbum = () => emit('getRandomAlbum')
</script>
