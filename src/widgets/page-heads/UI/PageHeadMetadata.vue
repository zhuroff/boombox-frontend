<template>
  <div class="album__hero-metadata">
    <div
      v-if="'artist' in album"
      class="album__hero-metadata-row"
    >
      {{ localize('embeddedForm.artist') }}:&nbsp;
      <RouterLink
        v-if="album.artist?._id"
        :to="`/artists/${album.artist._id}`"
        :disabled="!album.artist._id"
        class="album__hero-category --link"
      >
        {{ album.artist.title }}
      </RouterLink>
      <span
        v-else
        class="album__hero-category --link"
      >
        {{ album.artist.title }}
      </span>
    </div>

    <div
      v-if="'period' in album"
      class="album__hero-metadata-row"
    >
      {{ localize('embeddedForm.period') }}:&nbsp;
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
      {{ localize('embeddedForm.genre') }}:&nbsp;
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
import { useTranslate } from '~usecases/localization'

interface Props {
  album: UnifiedAlbum
  length?: string
}

defineProps<Props>()

const { localize } = useTranslate()
</script>

<style scoped lang="scss">
@use '~/app/styles/variables' as var;

.album__hero {

  &-metadata {
    color: var.$paleDP;
    line-height: 1.5;
  }

  &-category {
    color: inherit;

    &.--link {
      color: var.$white;
    }

    &[disabled=true] {
      pointer-events: none;
      cursor: default;
    }
  }
}
</style>
