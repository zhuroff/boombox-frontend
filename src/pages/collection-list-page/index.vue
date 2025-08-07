<template>
  <EntityListView
    entityKey="collections"
    placeholderPreview="/img/album.webp"
    pageHeadingKey="headings.collectionsPage"
    isDeletable
  />
</template>

<script setup lang="ts">
import { EntityListView } from '~views/entity-list-view'
</script>
