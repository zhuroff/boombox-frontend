<template>
  <div class="album">
    <slot name="head"></slot>
  </div>
</template>

<script setup lang="ts">

interface Props {
  album: UnifiedAlbum
  relatedAlbums: UnifiedRelatedAlbums[]
  // booklet?: BookletState
  // discogsTablePayload?: DiscogsTablePayload
  // discogsFilters?: DiscogsFilter
  // discogsFiltersStates?: Record<keyof DiscogsFilter, null | string>
  // relatedAlbums: Array<RelatedAlbums | RelatedCompilations>
  // isCompilation?: boolean
  // isTOY?: boolean
}

const props = defineProps<Props>()
</script>
