<template>
  <div class="album__hero-metadata">
    <div
      v-if="'artists' in album && Number(album.artists?.length) > 0"
      class="album__hero-metadata-row"
    >
      {{ localize('albumPageMetadata.artists') }}:&nbsp;
      <template
        v-for="(artist, idx) in album.artists"
        :key="artist._id"
      >
        <RouterLink
          v-if="artist?._id"
          :to="`/artists/${artist._id}`"
          :disabled="!artist._id"
          class="album__hero-category --link"
        >
          {{ artist.title }}
        </RouterLink>
        <span
          v-else
          class="album__hero-category --link"
        >
          {{ artist.title }}
        </span>
        <span v-if="idx < album.artists.length - 1">, </span>
      </template>
    </div>

    <div
      v-if="'period' in album"
      class="album__hero-metadata-row"
    >
      {{ localize('albumPageMetadata.period') }}:&nbsp;
      <RouterLink
        v-if="album.period?._id"
        :to="`/periods/${album.period._id}`"
        :disabled="!album.period._id"
        class="album__hero-category --link"
      >
        {{ album.period.title }}
      </RouterLink>
      <span
        v-else
        class="album__hero-category --link"
      >
        {{ album.period.title }}
      </span>
    </div>

    <div
      v-if="'genre' in album"
      class="album__hero-metadata-row"
    >
      {{ localize('albumPageMetadata.genre') }}:&nbsp;
      <RouterLink
        v-if="album.genre?._id"
        :to="`/genres/${album.genre._id}`"
        :disabled="!album.genre._id"
        class="album__hero-category --link"
      >
        {{ album.genre.title }}
      </RouterLink>
      <span
        v-else
        class="album__hero-category --link"
      >
        {{ album.genre.title }}
      </span>
    </div>

    <div
      v-if="'tracks' in album"
      class="album__hero-metadata-row"
    >
      {{ localize('conjugated.tracks.plural') }}:&nbsp;
      <span class="album__hero-category">
        {{ album.tracks.length }}
      </span>
    </div>

    <div
      v-if="length"
      class="album__hero-metadata-row"
    >
      {{ localize('totalLength') }}:&nbsp;
      <span class="album__hero-category">
        {{ length }}
    </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useLocalization } from '~shared/model'
import type { UnifiedEntityFullCard } from '~widgets/entity-cards'

interface Props {
  album: UnifiedEntityFullCard
  length?: string
}

defineProps<Props>()

const { localize } = useLocalization()
</script>

<style scoped lang="scss">
@use '~/app/styles/variables' as var;

.album__hero {

  &-metadata {

    @include var.media('<desktop') {
      color: var.$light;
      line-height: 1.7;
    }

    @include var.media('>=desktop') {
      color: var.$paleMD;
      margin-top: auto;
      line-height: 1.5;
    }
  }

  &-category {
    color: inherit;

    &.--link {
      color: var.$light;
    }

    &[disabled=true] {
      pointer-events: none;
      cursor: default;
    }
  }
}
</style>
