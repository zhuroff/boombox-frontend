<template>
  <EntityListView
    entityKey="compilations"
    placeholderPreview="/img/album.webp"
    pageHeadingKey="headings.albumsPage"
    isDeletable
  />
</template>

<script setup lang="ts">
import { EntityListView } from '~views/entity-list-view'
</script>
