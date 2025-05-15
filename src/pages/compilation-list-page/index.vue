<template>
  <EntityListView
    entityKey="compilations"
    placeholderPreview="/img/album.webp"
    pageHeadingKey="headings.albumsPage"
    :isDeletable="true"
  />
</template>

<script setup lang="ts">
import { EntityListView } from '~widgets/entity-list-view'
</script>
