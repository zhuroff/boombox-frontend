<template>
  <li class="album__row">
    <RouterLink
      v-if="isRoute"
      :to="`/albums/${album._id}`"
      class="album__row-link"
    >
      {{ (album.artists ?? []).map((a) => a.title).join(', ') || '—' }} - {{ album.title }}; {{ album.genre.title }}, {{ album.period.title }}
    </RouterLink>
    <div
      v-else
      class="album__row-info"
    >
      {{ (album.artists ?? []).map((a) => a.title).join(', ') || '—' }} - {{ album.title }}; {{ album.genre.title }}, {{ album.period.title }}
    </div>
  </li>
</template>

<script setup lang="ts">
import type { AlbumBasic } from '~entities/album'

interface Props {
  album: AlbumBasic
  isRoute: boolean
}

defineProps<Props>()
</script>

<style lang="scss" scoped>
@use '~/app/styles/variables' as var;

.album__row {
  margin-bottom: var.$fieldPadding;

  &-link {
    color: var.$dark;
    transition: color 0.2s var.$animation;

    &:hover {
      color: var.$success;
    }
  }

  &:last-of-type {
    margin-bottom: 0;
  }
}
</style>
